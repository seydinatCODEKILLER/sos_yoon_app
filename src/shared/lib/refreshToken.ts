import axios from "axios";
import { API_CONFIG } from "@/config/api.config";
import { tokenManager } from "./tokenManager";
import type { RefreshPayload, TokenResponse } from "@/features/auth/types/types";

const rawClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

let inflight: Promise<TokenResponse> | null = null;

/**
 * POST /auth/rafraichir — renvoie la session complète (jetons, utilisateur,
 * portée). Le refresh token est à usage unique : le nouveau remplace l'ancien.
 * Partagé entre l'intercepteur, la restauration de session et le socket (à venir).
 */
export function refreshSession(): Promise<TokenResponse> {
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) throw new Error("Pas de refresh token disponible");

      const payload: RefreshPayload = { refreshToken };
      const { data } = await rawClient.post<TokenResponse>(
        "/auth/rafraichir",
        payload,
      );

      tokenManager.saveTokens(data.accessToken, data.refreshToken);
      tokenManager.onSessionRefreshed(data); // met à jour user + portée dans le store
      return data;
    } catch (err) {
      tokenManager.clearTokens();
      tokenManager.logout("Session expirée. Veuillez vous reconnecter.");
      throw err;
    }
  })().finally(() => {
    inflight = null;
  });

  return inflight;
}

export async function refreshAccessToken(): Promise<string> {
  return (await refreshSession()).accessToken;
}