import { apiFetch } from "@/lib/api-client";
import type { CurrentUser, LoginResponse } from "./types";

export const authApi = {
  login: (payload: { username: string; password: string }) =>
    apiFetch<LoginResponse>("/auth/login", { method: "POST", body: payload }),

  register: (payload: { username: string; email: string; password: string }) =>
    apiFetch<CurrentUser>("/users/register", { method: "POST", body: payload }),

  logout: (refreshToken: string) =>
    apiFetch<void>("/auth/logout", { method: "POST", body: { refreshToken } }),

  me: () => apiFetch<CurrentUser>("/users/me"),
};
