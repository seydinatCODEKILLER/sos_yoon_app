import { create } from "zustand";
import type { Portee, User } from "@/types/user.types";
import { authApi } from "@/features/auth/api/authApi";
import { porteeFromStatut } from "@/features/auth/lib/portee";
import { tokenManager } from "@/shared/lib/tokenManager";
import type { TokenResponse } from "../types/types";
import { refreshSession } from "@/shared/lib/refreshToken";

interface AuthState {
  user: User | null;
  portee: Portee | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /** Connexion / inscription : enregistre les jetons et la session reçue. */
  setSession: (response: TokenResponse) => void;
  setUser: (user: User) => void;
  updateUser: (partialUser: Partial<User>) => void;
  logout: (reason?: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  portee: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (response) => {
    tokenManager.saveTokens(response.accessToken, response.refreshToken);
    set({
      user: response.utilisateur,
      portee: response.portee,
      isAuthenticated: true,
    });
  },

  setUser: (user) =>
    set({
      user,
      portee: porteeFromStatut(user.statutCompte),
      isAuthenticated: true,
    }),

  updateUser: (partialUser) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const user = { ...currentUser, ...partialUser };
    set({
      user,
      // le statut peut changer (ex. email vérifié) : la portée suit
      portee: porteeFromStatut(user.statutCompte),
    });
  },

  logout: async (reason) => {
    if (reason && import.meta.env.DEV) console.log("🔒 Logout:", reason);

    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      await authApi.deconnexion(refreshToken).catch(() => {});
    }

    tokenManager.clearTokens();
    set({ user: null, portee: null, isAuthenticated: false });
  },

initialize: async () => {
  if (!tokenManager.getRefreshToken()) {
    set({ isLoading: false });
    return;
  }

  try {
    // met le store à jour via le rappel de session, jetons inclus
    await refreshSession();
  } catch {
    // refreshSession a déjà vidé les jetons et déconnecté
  } finally {
    set({ isLoading: false });
  }
},
}));

tokenManager.setLogoutHandler(async (reason) => {
  await useAuthStore.getState().logout(reason);
});

tokenManager.setSessionHandler((response) => {
  useAuthStore.getState().setSession(response);
});