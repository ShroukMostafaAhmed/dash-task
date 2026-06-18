"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "Dashboard", href: ROUTES.admin.dashboard, icon: "📊" },
  { label: "Posts", href: ROUTES.admin.posts, icon: "📝" },
  { label: "Users", href: ROUTES.admin.users, icon: "👥" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    document.cookie = "auth=; path=/; max-age=0";
    router.push(ROUTES.admin.login);
  };

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <span className="font-bold text-blue-600 dark:text-blue-400">DashFlow</span>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <span aria-hidden="true">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
