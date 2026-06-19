import api from "./api";

export interface DashboardStats {
  userCount: number;
  postCount: number;
  commentCount: number;
}

export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const [usersRes, postsRes, commentsRes] = await Promise.all([
      api.get("/users"),
      api.get("/posts", { params: { _limit: 1 } }),
      api.get("/comments", { params: { _limit: 1 } }),
    ]);

    const postTotal = parseInt(postsRes.headers["x-total-count"] || "0", 10) || postsRes.data.length || 100;
    const commentTotal = parseInt(commentsRes.headers["x-total-count"] || "0", 10) || 500;

    return {
      userCount: usersRes.data.length,
      postCount: postTotal,
      commentCount: commentTotal,
    };
  },
};
