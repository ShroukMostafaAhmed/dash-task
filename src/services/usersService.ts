import api from "./api";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/types";

export interface FetchUsersParams {
  search?: string;
}

export interface FetchUsersResult {
  data: User[];
  total: number;
}

export const usersService = {
  async getAll({ search }: FetchUsersParams = {}): Promise<FetchUsersResult> {
    const params: Record<string, string> = {};
    if (search) params.username_like = search;

    const response = await api.get<User[]>("/users", { params });
    return { data: response.data, total: response.data.length };
  },

  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await api.post<User>("/users", payload);
    return response.data;
  },

  async update(id: number, payload: UpdateUserPayload): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, payload);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
