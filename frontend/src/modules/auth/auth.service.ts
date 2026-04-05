import { apiGet, apiPost, ApiError } from "@/lib/api-client";
import { setStoredAccessToken } from "@/lib/auth-token";
import { useAuthStore } from "./auth.store";
import type { User } from "./auth.type";

export async function login(credentials: Record<string, string>) {
  try {
    const res = await apiPost<{ access_token: string; user: User }>("/api/v1/auth/token", credentials);
    if (res?.access_token) setStoredAccessToken(res.access_token);
    if (res?.user) {
      useAuthStore.getState().setAuth(res.user);
    }
    return res;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new Error("login_failed");
  }
}

export async function logout() {
  try {
    await apiPost("/api/v1/auth/logout");
  } finally {
    useAuthStore.getState().clearAuth();
  }
}

export async function fetchCurrentUser() {
  try {
    const res = await apiGet<{ user: User }>("/api/v1/auth/user");
    if (res?.user) {
      useAuthStore.getState().setAuth(res.user);
    }
    return res?.user;
  } catch {
    setStoredAccessToken(null);
    useAuthStore.getState().clearAuth();
    return null;
  }
}
