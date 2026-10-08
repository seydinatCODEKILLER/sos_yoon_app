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

/** Pas d'en-tête Authorization sur ces chemins (comparés au début de l'URL). */
export const PUBLIC_ENDPOINTS = [
  "/auth/particulier/inscription/",
  "/auth/particulier/connexion/",
  "/auth/particulier/renvoyer-code",
  "/auth/pro/inscription",
  "/auth/pro/connexion",
  "/auth/email/",
  "/auth/mot-de-passe-oublie",
  "/auth/mot-de-passe/reinitialiser",
  "/auth/rafraichir",
  "/admin/auth/connexion",
  "/admin/auth/2fa/verifier",
  "/referentiels/",
] as const;

/** Un 401 ici est une vraie erreur (mauvais identifiants, jeton refusé) : pas de refresh. */
export const EXPECTED_401_ENDPOINTS = [
  "/auth/pro/connexion",
  "/admin/auth/connexion",
  "/admin/auth/2fa/verifier",
  "/auth/rafraichir",
] as const;
