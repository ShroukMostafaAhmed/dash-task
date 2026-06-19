"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { usersService } from "@/services/usersService";
import type { User } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { ROUTES, DEFAULT_PAGE_LIMIT } from "@/constants";

function UsersList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setLoading(true);
    usersService
      .getAll()
      .then((res) => setAllUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", String(page));
    router.replace(`${ROUTES.users}?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, page, router]);

  const filtered = debouncedSearch
    ? allUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          u.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : allUsers;

  const totalPages = Math.ceil(filtered.length / DEFAULT_PAGE_LIMIT);
  const paged = filtered.slice((page - 1) * DEFAULT_PAGE_LIMIT, page * DEFAULT_PAGE_LIMIT);

  return (
    <>
      <div className="mb-6 max-w-sm">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by username..."
        />
      </div>

      {loading ? (
        <PageSpinner />
      ) : paged.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map((user) => (
            <Card key={user.id}>
              <CardBody>
                <Link href={ROUTES.user(user.id)} className="group flex items-center gap-3">
                  <Avatar name={user.name} />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                  </div>
                </Link>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p className="truncate">✉ {user.email}</p>
                  <p className="truncate">🏢 {user.company.name}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Users</h1>
      <Suspense fallback={<PageSpinner />}>
        <UsersList />
      </Suspense>
    </div>
  );
}
