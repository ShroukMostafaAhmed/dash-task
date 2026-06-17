import { create } from "zustand";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/types";
import { usersService, type FetchUsersParams } from "@/services/usersService";
import { toast } from "sonner";

interface UsersState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchUsers: (params?: FetchUsersParams) => Promise<void>;
  createUser: (payload: CreateUserPayload) => Promise<boolean>;
  updateUser: (id: number, payload: UpdateUserPayload) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,

  fetchUsers: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await usersService.getAll(params);
      set({ users: result.data, total: result.total, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch users";
      set({ error: message, loading: false });
    }
  },

  createUser: async (payload) => {
    try {
      const newUser = await usersService.create(payload);
      const optimisticUser: User = {
        ...newUser,
        id: Date.now(),
        address: { street: "", suite: "", city: "", zipcode: "", geo: { lat: "", lng: "" } },
        company: { name: "", catchPhrase: "", bs: "" },
      };
      set((state) => ({
        users: [optimisticUser, ...state.users],
        total: state.total + 1,
      }));
      toast.success("User created successfully");
      return true;
    } catch {
      toast.error("Failed to create user");
      return false;
    }
  },

  updateUser: async (id, payload) => {
    const previous = get().users;
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...payload } : u)),
    }));
    try {
      await usersService.update(id, payload);
      toast.success("User updated successfully");
      return true;
    } catch {
      set({ users: previous });
      toast.error("Failed to update user");
      return false;
    }
  },

  deleteUser: async (id) => {
    const previous = get().users;
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
      total: state.total - 1,
    }));
    try {
      await usersService.delete(id);
      toast.success("User deleted successfully");
      return true;
    } catch {
      set({ users: previous, total: previous.length });
      toast.error("Failed to delete user");
      return false;
    }
  },
}));
