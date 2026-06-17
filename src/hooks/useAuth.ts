import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { isAuthenticated, login, logout } = useAuthStore();
  return { isAuthenticated, login, logout };
}
