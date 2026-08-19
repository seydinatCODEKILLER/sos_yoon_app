import axios from "axios";
import { API_CONFIG } from "@/config/api.config";
import { tokenManager } from "./tokenManager";

const rawClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

/**
 * Rafraîchit l'access token. Point d'entrée unique, partagé entre
 * l'intercepteur Axios (apiClient.ts) et le socket (à venir),
 * pour ne jamais dupliquer la logique de rotation des tokens.
 *
 * ⚠️ json-server-auth ne fournit pas nativement de mécanisme de refresh
 * token — cette fonction est prête pour le vrai backend, mais échouera
 * tant qu'on est sur le mock. À activer réellement une fois l'API prête.
 */
export async function refreshAccessToken(): Promise<string> {
  if (tokenManager.isRefreshing) {
    return new Promise((resolve) => {
      tokenManager.subscribeTokenRefresh((newToken) => resolve(newToken));
    });
  }

  tokenManager.isRefreshing = true;

  try {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("Pas de refresh token disponible");
    }

    const response = await rawClient.post("/refresh", { refreshToken });

    const newAccessToken: string = response.data.accessToken;
    const newRefreshToken: string = response.data.refreshToken;

    tokenManager.saveTokens(newAccessToken, newRefreshToken);
    tokenManager.onTokenRefreshed(newAccessToken);
    return newAccessToken;
  } catch (err) {
    tokenManager.onRefreshFailed();
    tokenManager.clearTokens();
    tokenManager.logout("Session expirée. Veuillez vous reconnecter.");
    throw err;
  } finally {
    tokenManager.isRefreshing = false;
  }
}
