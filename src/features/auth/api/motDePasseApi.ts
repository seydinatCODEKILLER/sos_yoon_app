import { apiClient } from "@/shared/lib/apiClient";

export interface ReinitialisationPayload {
  token: string;
  nouveauMotDePasse: string;
  confirmation: string;
}

export interface MotDePasseApi {
  /** Répond toujours 202, que le compte existe ou non */
  demanderLien(email: string): Promise<void>;
  /** 400 JETON_INVALIDE · 410 JETON_EXPIRE */
  reinitialiser(payload: ReinitialisationPayload): Promise<void>;
}

export const motDePasseApi: MotDePasseApi = {
  async demanderLien(email) {
    await apiClient.post("/auth/mot-de-passe-oublie", { email });
  },

  async reinitialiser(payload) {
    await apiClient.post("/auth/mot-de-passe/reinitialiser", payload);
  },
};