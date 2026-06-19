"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useUsersStore } from "@/store/usersStore";
import { useDebounce } from "@/hooks/useDebounce";
import type { User, CreateUserPayload } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { SearchInput } from "@/components/shared/SearchInput";
import { ROUTES, DEFAULT_PAGE_LIMIT } from "@/constants";

type UserForm = CreateUserPayload;

function AdminUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { users, total, loading, fetchUsers, createUser, updateUser, deleteUser } = useUsersStore();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const debouncedSearch = useDebounce(search, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<UserForm>();
  const totalPages = Math.ceil(total / DEFAULT_PAGE_LIMIT);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", String(page));
    router.replace(`${ROUTES.admin.users}?${params.toString()}`, { scroll: false });
    fetchUsers({ search: debouncedSearch });
  }, [debouncedSearch, page, router, fetchUsers]);

  const openCreate = () => {
    setEditTarget(null);
    reset({ name: "", username: "", email: "", phone: "", website: "" });
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditTarget(user);
    reset({ name: user.name, username: user.username, email: user.email, phone: user.phone, website: user.website });
    setModalOpen(true);
  };

  const onSubmit = async (data: UserForm) => {
    setSaving(true);
    if (editTarget) {
      await updateUser(editTarget.id, data);
    } else {
      await createUser(data);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteUser(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  const pagedUsers = users.slice((page - 1) * DEFAULT_PAGE_LIMIT, page * DEFAULT_PAGE_LIMIT);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <Button onClick={openCreate}>+ New User</Button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users..." />
      </div>

      {loading ? (
        <PageSpinner />
      ) : pagedUsers.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["User", "Email", "Phone", "Company", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pagedUsers.map((user) => (
                <tr key={user.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.phone}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.company.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(user)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(user)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit User" : "Create User"}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input label="Name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
          <Input label="Username" error={errors.username?.message} {...register("username", { required: "Username is required" })} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email", { required: "Email is required" })} />
          <Input label="Phone" {...register("phone")} />
          <Input label="Website" {...register("website")} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving} disabled={editTarget ? !isDirty : false}>
              {editTarget ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        loading={deleting}
      />
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <AdminUsersContent />
    </Suspense>
  );
}
