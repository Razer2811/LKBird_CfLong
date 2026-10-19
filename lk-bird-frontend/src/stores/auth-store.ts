import { useSyncExternalStore } from "react";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/api-client";

const USERNAME_KEY = "username";
const ROLE_KEY = "role";

export type AuthRole = "ADMIN" | "USER" | (string & {});

export type AuthState = {
  username: string | null;
  role: AuthRole | null;
  isAuthenticated: boolean;
  /** false cho tới khi đọc xong localStorage ở phía trình duyệt */
  ready: boolean;
};

export type SessionPayload = {
  username: string;
  role: AuthRole;
  accessToken: string;
  refreshToken?: string | null;
};

const emptyState: AuthState = { username: null, role: null, isAuthenticated: false, ready: false };
const signedOutState: AuthState = { ...emptyState, ready: true };

let state: AuthState = emptyState;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthState(): AuthState {
  return state;
}

export function hydrateSession() {
  if (typeof window === "undefined") return;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const username = window.localStorage.getItem(USERNAME_KEY);
  const role = window.localStorage.getItem(ROLE_KEY);

  state = accessToken
    ? { username, role, isAuthenticated: true, ready: true }
    : signedOutState;

  emit();
}

export function setSession(payload: SessionPayload) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
    window.localStorage.setItem(USERNAME_KEY, payload.username);
    window.localStorage.setItem(ROLE_KEY, payload.role);

    if (payload.refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
    }
  }

  state = { username: payload.username, role: payload.role, isAuthenticated: true, ready: true };
  emit();
}

export function clearSession() {
  if (typeof window !== "undefined") {
    [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USERNAME_KEY, ROLE_KEY].forEach((key) =>
      window.localStorage.removeItem(key),
    );
  }

  state = signedOutState;
  emit();
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

/** Trạng thái đăng nhập; luôn trả về "chưa đăng nhập" khi render trên server. */
export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, getAuthState, () => emptyState);
}
