import { apiClient } from "@/shared/lib/apiClient";
import type {
  ChangerMotDePassePayload,
  ProfilAdmin,
  ProfilAdminPayload,
  SessionAdmin,
} from "../types/parametres.types";

export const parametresAdminApi = {
  async profil(): Promise<ProfilAdmin> {
    const { data } = await apiClient.get("/admin/profil");
    return data;
  },
  async modifierProfil(payload: ProfilAdminPayload): Promise<ProfilAdmin> {
    const { data } = await apiClient.put("/admin/profil", payload);
    return data;
  },
  async sessions(): Promise<SessionAdmin[]> {
    const { data } = await apiClient.get("/admin/sessions");
    return data;
  },
  async deconnecterSession(id: string): Promise<void> {
    await apiClient.delete(`/admin/sessions/${id}`);
  },
  async deconnecterAutresSessions(): Promise<void> {
    await apiClient.delete("/admin/sessions");
  },
  async changerMotDePasse(payload: ChangerMotDePassePayload): Promise<void> {
    await apiClient.put("/auth/mot-de-passe", payload);
  },
};

export type ParametresAdminApi = typeof parametresAdminApi;