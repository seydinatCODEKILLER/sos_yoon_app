import { create } from "zustand";
import type { User } from "@/types/user.types";
import { authApi } from "@/features/auth/api/authApi";
import { tokenManager } from "@/shared/lib/tokenManager";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  updateUser: (partialUser: Partial<User>) => void;
  logout: (reason?: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  updateUser: (partialUser) => {
    const currentUser = get().user;
    if (!currentUser) return;
    set({ user: { ...currentUser, ...partialUser } });
  },

  logout: async (reason) => {
    if (reason && import.meta.env.DEV) console.log("🔒 Logout:", reason);

    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => {});
    }

    tokenManager.clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  initialize: async () => {
    const token = tokenManager.getAccessToken();

    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const user = await authApi.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("❌ Erreur initialisation auth:", error);
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));

tokenManager.setLogoutHandler(async (reason) => {
  await useAuthStore.getState().logout(reason);
});
