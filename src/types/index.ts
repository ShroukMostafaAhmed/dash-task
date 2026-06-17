export * from "./user";
export * from "./post";

export interface ApiError {
  message: string;
  status?: number;
}
