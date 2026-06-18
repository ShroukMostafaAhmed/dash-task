import Link from "next/link";
import { usersService } from "@/services/usersService";
import { postsService } from "@/services/postsService";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ROUTES } from "@/constants";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const userId = Number(id);

  let user, posts;
  try {
    [user, posts] = await Promise.all([
      usersService.getById(userId),
      postsService.getByUserId(userId),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={ROUTES.users} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
        ← Back to Users
      </Link>

      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={user.name} size="lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone },
              { label: "Website", value: user.website },
              { label: "City", value: user.address.city },
              { label: "Company", value: user.company.name },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </CardBody>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          Posts
          <Badge variant="info">{posts.length}</Badge>
        </h2>
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardBody>
                <Link href={ROUTES.post(post.id)} className="group">
                  <p className="font-medium text-gray-900 dark:text-white capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                    {post.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{post.body}</p>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
