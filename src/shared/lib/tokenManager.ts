import { PUBLIC_ENDPOINTS } from "@/config/api.config";

const KEYS = {
  ACCESS_TOKEN: "sosyoon_access_token",
  REFRESH_TOKEN: "sosyoon_refresh_token",
} as const;

class TokenManager {
  private logoutHandler: ((reason?: string) => void) | null = null;
  private refreshSubscribers: ((token: string) => void)[] = [];
  isRefreshing = false;

  // ── Stockage ─────────────────────────────────────────────────
  // NOTE SÉCURITÉ : localStorage est vulnérable au XSS. À migrer vers
  // un cookie httpOnly géré par le backend si celui-ci le supporte
  // une fois l'API réelle disponible.

  saveTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.REFRESH_TOKEN);
  }

  clearTokens(): void {
    localStorage.removeItem(KEYS.ACCESS_TOKEN);
    localStorage.removeItem(KEYS.REFRESH_TOKEN);
  }

  // ── File d'attente pendant le refresh ───────────────────────

  subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  onTokenRefreshed(newToken: string): void {
    this.refreshSubscribers.forEach((cb) => cb(newToken));
    this.refreshSubscribers = [];
  }

  onRefreshFailed(): void {
    this.refreshSubscribers = [];
  }

  // ── Logout ───────────────────────────────────────────────────

  setLogoutHandler(handler: (reason?: string) => void): void {
    this.logoutHandler = handler;
  }

  logout(reason?: string): void {
    this.logoutHandler?.(reason);
  }

  // ── Utils ────────────────────────────────────────────────────

  isPublicEndpoint(url: string): boolean {
    return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
  }
}

export const tokenManager = new TokenManager();
