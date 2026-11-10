import { apiClient } from "@/shared/lib/apiClient";
import type {
  ProfilPayload,
  ProfilPro,
  SpecialitesPayload,
  ZonePayload,
} from "../types/profil.types";

export interface ProfilApi {
  obtenir(): Promise<ProfilPro>;
  mettreAJour(payload: ProfilPayload): Promise<ProfilPro>;
  envoyerPhoto(fichier: File): Promise<{ photoUrl: string }>;
  /** 422 SPECIALITE_DOMINANTE_HORS_LISTE, 404 si une spécialité n'existe pas */
  mettreAJourSpecialites(payload: SpecialitesPayload): Promise<ProfilPro>;
  /** 400 VALIDATION_ERREUR (rayon de 1 à 200 km, coordonnées, région inconnue) */
  mettreAJourZone(payload: ZonePayload): Promise<ProfilPro>;
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

  async mettreAJourSpecialites(payload) {
    const { data } = await apiClient.put<ProfilPro>("/pro/profil/specialites", payload);
    return data;
  },

  async mettreAJourZone(payload) {
    const { data } = await apiClient.put<ProfilPro>("/pro/profil/zone", payload);
    return data;
  },
};