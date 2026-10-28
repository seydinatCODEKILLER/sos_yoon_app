import { apiClient } from "@/shared/lib/apiClient";
import type { ProfilPayload, ProfilPro } from "../types/profil.types";

export interface ProfilApi {
  obtenir(): Promise<ProfilPro>;
  mettreAJour(payload: ProfilPayload): Promise<ProfilPro>;
  envoyerPhoto(fichier: File): Promise<{ photoUrl: string }>;
}

export const profilApi: ProfilApi = {
  async obtenir() {
    const { data } = await apiClient.get<ProfilPro>("/pro/profil");
    return data;
  },

  async mettreAJour(payload) {
    const { data } = await apiClient.put<ProfilPro>("/pro/profil", payload);
    return data;
  },

  async envoyerPhoto(fichier) {
    const form = new FormData();
    form.append("fichier", fichier);
    const { data } = await apiClient.post<{ photoUrl: string }>("/pro/profil/photo", form);
    return data;
  },
};