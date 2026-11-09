export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

if (!API_CONFIG.BASE_URL) {
  throw new Error("VITE_API_URL non définie ! Vérifie ton fichier .env");
}

/**
 * Pas de "Content-Type" ici, volontairement. Axios le pose tout seul :
 *  - objet JSON      → application/json
 *  - FormData        → multipart/form-data avec le bon « boundary » (posé par le navigateur)
 * Si on l'impose globalement à application/json, axios transforme chaque FormData en JSON :
 * le backend reçoit alors « Current request is not a multipart request ».
 */
export const DEFAULT_HEADERS = {
  Accept: "application/json",
} as const;

/**
 * Pas d'en-tête Authorization sur ces chemins (comparés au début de l'URL).
 * Attention : "/auth/particulier/connexion" SANS barre finale, sinon la
 * connexion elle-même (POST /auth/particulier/connexion) n'est pas couverte.
 */
export const PUBLIC_ENDPOINTS = [
  "/auth/particulier/inscription/",
  "/auth/particulier/connexion",
  "/auth/particulier/code-oublie/",
  "/auth/particulier/renvoyer-code",
  "/auth/pro/inscription",
  "/auth/pro/connexion",
  "/auth/email/",
  "/auth/mot-de-passe-oublie",
  "/auth/mot-de-passe/reinitialiser",
  "/auth/rafraichir",
  "/admin/auth/connexion",
  "/referentiels/",
] as const;

/** Un 401 ici est une vraie erreur (mauvais identifiants, jeton refusé) : pas de refresh. */
export const EXPECTED_401_ENDPOINTS = [
  "/auth/particulier/connexion",
  "/auth/pro/connexion",
  "/admin/auth/connexion",
  "/auth/rafraichir",
] as const;