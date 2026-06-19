"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { usePostsStore } from "@/store/postsStore";
import { useUsersStore } from "@/store/usersStore";
import { useDebounce } from "@/hooks/useDebounce";
import type { Post, CreatePostPayload } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/shared/SearchInput";
import { ROUTES, DEFAULT_PAGE_LIMIT } from "@/constants";

type PostForm = CreatePostPayload;

function AdminPostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { posts, total, loading, fetchPosts, createPost, updatePost, deletePost } = usePostsStore();
  const { users, fetchUsers } = useUsersStore();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const debouncedSearch = useDebounce(search, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Post | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PostForm>();
  const totalPages = Math.ceil(total / DEFAULT_PAGE_LIMIT);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", String(page));
    router.replace(`${ROUTES.admin.posts}?${params.toString()}`, { scroll: false });
    fetchPosts({ page, limit: DEFAULT_PAGE_LIMIT, search: debouncedSearch });
  }, [debouncedSearch, page, router, fetchPosts]);

  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));

  const openCreate = () => {
    setEditTarget(null);
    reset({ title: "", body: "", userId: users[0]?.id });
    setModalOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditTarget(post);
    reset({ title: post.title, body: post.body, userId: post.userId });
    setModalOpen(true);
  };

  const onSubmit = async (data: PostForm) => {
    setSaving(true);
    const payload = { ...data, userId: Number(data.userId) };
    if (editTarget) {
      await updatePost(editTarget.id, payload);
    } else {
      await createPost(payload);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await deletePost(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
        <Button onClick={openCreate}>+ New Post</Button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search posts..." />
      </div>

      {loading ? (
        <PageSpinner />
      ) : posts.length === 0 ? (
        <EmptyState title="No posts found" />
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["#", "Title", "Body", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-gray-400 w-12">{post.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white capitalize max-w-[200px] truncate">{post.title}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs truncate">{post.body}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(post)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(post)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Post" : "Create Post"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input label="Title" error={errors.title?.message} {...register("title", { required: "Title is required" })} />
          <Textarea label="Body" error={errors.body?.message} {...register("body", { required: "Body is required" })} />
          <Select label="Author" options={userOptions} error={errors.userId?.message} {...register("userId", { required: "Author is required" })} />
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
        title="Delete Post"
        description="Are you sure you want to delete this post?"
        loading={deleting}
      />
    </>
  );
}

export default function AdminPostsPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <AdminPostsContent />
    </Suspense>
  );
}
