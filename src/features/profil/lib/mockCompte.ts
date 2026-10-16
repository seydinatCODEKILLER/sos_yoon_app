import type { ApiErreur } from "@/types/api.types";
import type { CompteApi } from "../api/compteApi";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Même code secret que le profil mock
const CODE_MOCK = "1234";
let essaisRestants = 3;

function erreur(
  code: string,
  message: string,
  details?: Record<string, unknown>,
): ApiErreur {
  return { code, message, details } as unknown as ApiErreur;
}

export const mockCompteApi: CompteApi = {
  async supprimer(payload) {
    await wait(800);

    if (essaisRestants === 0) {
      throw erreur("COMPTE_VERROUILLE", "Compte verrouillé.");
    }
    if (payload.codeSecret !== CODE_MOCK) {
      essaisRestants -= 1;
      if (essaisRestants === 0) {
        throw erreur("COMPTE_VERROUILLE", "Compte verrouillé.");
      }
      throw erreur("CODE_SECRET_INCORRECT", "Code secret incorrect.", {
        essaisRestants,
      });
    }
  },
};