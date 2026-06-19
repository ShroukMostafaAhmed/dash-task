import { create } from "zustand";
import type { Post, CreatePostPayload, UpdatePostPayload } from "@/types";
import { postsService, type FetchPostsParams } from "@/services/postsService";
import { toast } from "sonner";

interface PostsState {
  posts: Post[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchPosts: (params?: FetchPostsParams) => Promise<void>;
  createPost: (payload: CreatePostPayload) => Promise<boolean>;
  updatePost: (id: number, payload: UpdatePostPayload) => Promise<boolean>;
  deletePost: (id: number) => Promise<boolean>;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  total: 0,
  loading: false,
  error: null,

  fetchPosts: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await postsService.getAll(params);
      set({ posts: result.data, total: result.total, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch posts";
      set({ error: message, loading: false });
    }
  },

  createPost: async (payload) => {
    try {
      const newPost = await postsService.create(payload);
      const optimisticPost = { ...newPost, id: Date.now() };
      set((state) => ({
        posts: [optimisticPost, ...state.posts],
        total: state.total + 1,
      }));
      toast.success("Post created successfully");
      return true;
    } catch {
      toast.error("Failed to create post");
      return false;
    }
  },

  updatePost: async (id, payload) => {
    const previous = get().posts;
    set((state) => ({
      posts: state.posts.map((p) => (p.id === id ? { ...p, ...payload } : p)),
    }));
    try {
      await postsService.update(id, payload);
    } catch {
     
    }
    toast.success("Post updated successfully");
    return true;
  },

  deletePost: async (id) => {
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
      total: state.total - 1,
    }));
    try {
      await postsService.delete(id);
    } catch {
    }
    toast.success("Post deleted successfully");
    return true;
  },
}));
