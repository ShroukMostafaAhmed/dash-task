"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { postsService } from "@/services/postsService";
import type { Post } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/ui/Pagination";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardBody } from "@/components/ui/Card";
import { SearchInput } from "@/components/shared/SearchInput";
import { ROUTES, DEFAULT_PAGE_LIMIT } from "@/constants";

function PostsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const debouncedSearch = useDebounce(search, 400);
  const totalPages = Math.ceil(total / DEFAULT_PAGE_LIMIT);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", String(page));
    router.replace(`${ROUTES.posts}?${params.toString()}`, { scroll: false });

    setLoading(true);
    postsService
      .getAll({ page, limit: DEFAULT_PAGE_LIMIT, search: debouncedSearch })
      .then((res) => { setPosts(res.data); setTotal(res.total); })
      .finally(() => setLoading(false));
  }, [debouncedSearch, page, router]);

  return (
    <>
      <div className="mb-6 max-w-sm">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search posts..." />
      </div>

      {loading ? (
        <PageSpinner />
      ) : posts.length === 0 ? (
        <EmptyState title="No posts found" description="Try a different search term." />
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardBody>
                <Link href={ROUTES.post(post.id)} className="group">
                  <h2 className="font-semibold text-gray-900 dark:text-white capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.body}</p>
                  <span className="mt-2 inline-block text-xs text-blue-600 dark:text-blue-400 font-medium">Read more →</span>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

export default function PostsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Posts</h1>
      <Suspense fallback={<PageSpinner />}>
        <PostsList />
      </Suspense>
    </div>
  );
}
