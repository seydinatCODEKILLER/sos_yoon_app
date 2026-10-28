import type { ApiErreur } from "@/types/api.types";
import type { MotDePasseApi } from "../api/motDePasseApi";

const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));

const erreur = (code: string, message: string): ApiErreur => ({
  code,
  message,
  horodatage: new Date().toISOString(),
});

/**
 * Pour tester la page de réinitialisation en mock :
 *  - /reinitialiser-mot-de-passe?token=test      → succès
 *  - /reinitialiser-mot-de-passe?token=expire    → lien expiré (410)
 *  - /reinitialiser-mot-de-passe?token=invalide  → lien invalide (400)
 */
export const mockMotDePasseApi: MotDePasseApi = {
  async demanderLien() {
    await wait();
  },

  async reinitialiser({ token }) {
    await wait();
    if (token === "expire") {
      throw erreur("JETON_EXPIRE", "Ce lien a expiré.");
    }
    if (token === "invalide") {
      throw erreur("JETON_INVALIDE", "Ce lien n'est pas valide.");
    }
  },
};