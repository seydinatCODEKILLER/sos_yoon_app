import { apiClient } from "@/shared/lib/apiClient";
import type {
  ChangementStatutPayload,
  CompteursUtilisateurs,
  MotifAdmin,
  PageUtilisateurs,
  ParamsUtilisateurs,
  TypeMotif,
} from "../types/utilisateurs.types";

export const utilisateursAdminApi = {
  async lister(params: ParamsUtilisateurs): Promise<PageUtilisateurs> {
    const { data } = await apiClient.get("/admin/utilisateurs", {
      params: { ...params, q: params.q || undefined },
    });
    return data;
  },
  async compteurs(): Promise<CompteursUtilisateurs> {
    const { data } = await apiClient.get("/admin/utilisateurs/compteurs");
    return data;
  },
async motifs(type: TypeMotif): Promise<MotifAdmin[]> {
  const { data } = await apiClient.get("/admin/motifs", { params: { type } });
  return data;
},
  async desactiver(id: string, payload: ChangementStatutPayload) {
    const { data } = await apiClient.post(`/admin/utilisateurs/${id}/desactiver`, payload);
    return data;
  },
  async reactiver(id: string, payload: ChangementStatutPayload) {
    const { data } = await apiClient.post(`/admin/utilisateurs/${id}/reactiver`, payload);
    return data;
  },
};

export type UtilisateursAdminApi = typeof utilisateursAdminApi;