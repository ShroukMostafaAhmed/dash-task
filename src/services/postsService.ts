import api from "./api";
import type { Post, Comment, CreatePostPayload, UpdatePostPayload } from "@/types";

export interface FetchPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: number;
}

export interface FetchPostsResult {
  data: Post[];
  total: number;
}

export const postsService = {
  async getAll({ page = 1, limit = 10, search, userId }: FetchPostsParams = {}): Promise<FetchPostsResult> {
    const params: Record<string, string | number> = {
      _page: page,
      _limit: limit,
    };
    if (search) params.title_like = search;
    if (userId) params.userId = userId;

    const response = await api.get<Post[]>("/posts", { params });
    const total = parseInt(response.headers["x-total-count"] || "100", 10);
    return { data: response.data, total };
  },

  async getById(id: number): Promise<Post> {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  async getComments(postId: number): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  },

  async getByUserId(userId: number): Promise<Post[]> {
    const response = await api.get<Post[]>(`/users/${userId}/posts`);
    return response.data;
  },

  async create(payload: CreatePostPayload): Promise<Post> {
    const response = await api.post<Post>("/posts", payload);
    return response.data;
  },

  async update(id: number, payload: UpdatePostPayload): Promise<Post> {
    const response = await api.put<Post>(`/posts/${id}`, payload);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};
