export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

if (!API_CONFIG.BASE_URL) {
  throw new Error("VITE_API_URL non définie ! Vérifie ton fichier .env");
}

export const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

export const PUBLIC_ENDPOINTS = ["/register", "/login", "/refresh"] as const;

export const EXPECTED_401_ENDPOINTS = ["/login", "/refresh"] as const;
