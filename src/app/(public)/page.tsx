import Link from "next/link";
import { ROUTES } from "@/constants";

export default function HomePage() {
  return (
    <div className="py-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-blue-600">DashFlow</span>
        </h1>

        <div className="flex flex-wrap gap-4">
          <Link
            href={ROUTES.posts}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Posts
          </Link>
          <Link
            href={ROUTES.users}
            className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Browse Users
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Public Posts", desc: "Browse and search all posts", href: ROUTES.posts, emoji: "📝" },
          { label: "Public Users", desc: "Explore user profiles", href: ROUTES.users, emoji: "👥" },
          { label: "Admin Panel", desc: "Manage posts and users", href: ROUTES.admin.login, emoji: "🔒" },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-blue-400 dark:hover:border-blue-500 transition-colors shadow-sm"
          >
            <div className="text-3xl mb-3">{card.emoji}</div>
            <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {card.label}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
