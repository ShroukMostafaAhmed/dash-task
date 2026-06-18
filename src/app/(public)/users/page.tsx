"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { usersService } from "@/services/usersService";
import type { User } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { SearchInput } from "@/components/shared/SearchInput";
import { ROUTES } from "@/constants";

function UsersList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    router.replace(`${ROUTES.users}?${params.toString()}`, { scroll: false });

    setLoading(true);
    usersService
      .getAll({ search: debouncedSearch })
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, [debouncedSearch, router]);

  return (
    <>
      <div className="mb-6 max-w-sm">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Search by username..." />
      </div>

      {loading ? (
        <PageSpinner />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
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
