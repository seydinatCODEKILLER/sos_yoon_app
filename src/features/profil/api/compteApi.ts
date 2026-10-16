import { apiClient } from "@/shared/lib/apiClient";
import type { SupprimerComptePayload } from "../types/profil.types";

export interface CompteApi {
  supprimer(payload: SupprimerComptePayload): Promise<void>;
}

export const compteApi: CompteApi = {
  async supprimer(payload) {
    await apiClient.post("/profil/supprimer", payload);
  },
};