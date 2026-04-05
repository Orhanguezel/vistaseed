import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setStoredAccessToken } from "@/lib/auth-token";
import type { User, UserRole } from "./auth.type";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  checkRole: (allowed: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false });
      },

      clearAuth: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
        setStoredAccessToken(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("app-auth");
        }
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      checkRole: (allowed: UserRole[]) => {
        const { user } = get();
        if (!user) return false;
        return allowed.includes(user.role);
      },
    }),
    {
      name: "app-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
