export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://jsonplaceholder.typicode.com";

export const DEFAULT_PAGE_LIMIT = 10;

export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
} as const;

export const ROUTES = {
  home: "/",
  posts: "/posts",
  post: (id: number | string) => `/posts/${id}`,
  users: "/users",
  user: (id: number | string) => `/users/${id}`,
  admin: {
    login: "/admin/login",
    dashboard: "/admin",
    posts: "/admin/posts",
    users: "/admin/users",
  },
} as const;
