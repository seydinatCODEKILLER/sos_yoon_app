import { apiClient } from "@/shared/lib/apiClient";
import type {
  ChangerCodeSecretPayload,
  ConfirmerChangementTelephonePayload,
  DemanderChangementTelephonePayload,
  EnvoiCodeTelephone,
  ModifierProfilPayload,
  ProfilParticulier,
  Region,
  Zone,
} from "../types/profil.types";

export interface ProfilApi {
  obtenir(): Promise<ProfilParticulier>;
  changerPhoto(photo: Blob): Promise<{ photoUrl: string }>;
  supprimerPhoto(): Promise<void>;
  changerCodeSecret(payload: ChangerCodeSecretPayload): Promise<void>;
  modifier(payload: ModifierProfilPayload): Promise<ProfilParticulier>;
  /** Envoie un code SMS au NOUVEAU numéro (l'ancien reste valable) */
  demanderChangementTelephone(
    payload: DemanderChangementTelephonePayload,
  ): Promise<EnvoiCodeTelephone>;
  /** Valide le code et remplace le numéro */
  confirmerChangementTelephone(
    payload: ConfirmerChangementTelephonePayload,
  ): Promise<ProfilParticulier>;
  regions(): Promise<Region[]>;
  /** recherche : 2 caractères minimum, sinon omise (les 50 premières zones) */
  zones(regionId: string, recherche?: string): Promise<Zone[]>;
}

export const profilApi: ProfilApi = {
  async obtenir() {
    const { data } = await apiClient.get<ProfilParticulier>("/particulier/profil");
    return data;
  },

  async changerPhoto(photo) {
    const form = new FormData();
    // Le champ s'appelle « fichier » côté backend (JPG ou PNG, 3 Mo max)
    form.append("fichier", photo, "photo.jpg");
    const { data } = await apiClient.post<{ photoUrl: string }>(
      "/particulier/profil/photo",
      form,
    );
    return data;
  },

  async supprimerPhoto() {
    await apiClient.delete("/particulier/profil/photo");
  },

  async changerCodeSecret(payload) {
    await apiClient.post("/particulier/code-secret", payload);
  },

  async modifier(payload) {
    const { data } = await apiClient.put<ProfilParticulier>(
      "/particulier/profil",
      payload,
    );
    return data;
  },

  async demanderChangementTelephone(payload) {
    const { data } = await apiClient.post<EnvoiCodeTelephone>(
      "/particulier/telephone/demander-changement",
      payload,
    );
    return data;
  },

  async confirmerChangementTelephone(payload) {
    const { data } = await apiClient.post<ProfilParticulier>(
      "/particulier/telephone/confirmer-changement",
      payload,
    );
    return data;
  },

  async regions() {
    const { data } = await apiClient.get<Region[]>("/referentiels/regions");
    return data;
  },

  async zones(regionId, recherche) {
    const { data } = await apiClient.get<Zone[]>("/referentiels/zones", {
      params: {
        regionId,
        ...(recherche && recherche.length >= 2 ? { q: recherche } : {}),
        taille: 50,
      },
    });
    return data;
  },
};