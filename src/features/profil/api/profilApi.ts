import { apiClient } from "@/shared/lib/apiClient";
import type {
  ChangerCodeSecretPayload,
  ModifierProfilPayload,
  ProfilParticulier,
  Region,
} from "../types/profil.types";
import type { Commune } from "@/features/demandes/types/demande.types";

export interface ProfilApi {
  obtenir(): Promise<ProfilParticulier>;
  changerPhoto(photo: Blob): Promise<{ photoUrl: string }>;
  supprimerPhoto(): Promise<void>;
  changerCodeSecret(payload: ChangerCodeSecretPayload): Promise<void>;
  modifier(payload: ModifierProfilPayload): Promise<ProfilParticulier>;
  regions(): Promise<Region[]>;
  communesDeRegion(regionId: number): Promise<Commune[]>;
}

export const profilApi: ProfilApi = {
  async obtenir() {
    const { data } = await apiClient.get<ProfilParticulier>("/profil");
    return data;
  },

  async changerPhoto(photo) {
    const form = new FormData();
    form.append("photo", photo, "photo.jpg");
    const { data } = await apiClient.put<{ photoUrl: string }>(
      "/profil/photo",
      form,
    );
    return data;
  },

  async supprimerPhoto() {
    await apiClient.delete("/profil/photo");
  },

  async changerCodeSecret(payload) {
    await apiClient.put("/profil/code-secret", payload);
  },

    async modifier(payload) {
    const { data } = await apiClient.put<ProfilParticulier>("/profil", payload);
    return data;
  },

  async regions() {
    const { data } = await apiClient.get<Region[]>("/referentiels/regions");
    return data;
  },

  async communesDeRegion(regionId) {
    const { data } = await apiClient.get<Commune[]>("/referentiels/communes", {
      params: { regionId },
    });
    return data;
  },
};
