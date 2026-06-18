import Link from "next/link";
import { postsService } from "@/services/postsService";
import { usersService } from "@/services/usersService";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ROUTES } from "@/constants";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);

  let post, comments, author;
  try {
    [post, comments] = await Promise.all([
      postsService.getById(postId),
      postsService.getComments(postId),
    ]);
    author = await usersService.getById(post.userId);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={ROUTES.posts} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
        ← Back to Posts
      </Link>

      <Card className="mb-6">
        <CardBody>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize mb-4">
            {post.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{post.body}</p>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Avatar name={author.name} size="sm" />
            <div>
              <Link href={ROUTES.user(author.id)} className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                {author.name}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">@{author.username}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          Comments
          <Badge variant="info">{comments.length}</Badge>
        </h2>
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <Card key={c.id}>
              <CardBody>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{c.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{c.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
