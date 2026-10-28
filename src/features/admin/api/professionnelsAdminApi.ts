import { apiClient } from "@/shared/lib/apiClient";
import type {
  ChangementStatutProPayload,
  CompteursProfessionnels,
  MotifAdmin,
  PageProfessionnels,
  ParamsProfessionnels,
  ProfessionnelAdminDetail,
  RefusDossierPayload,
  TypeMotifPro,
} from "../types/professionnels.types";

export const professionnelsAdminApi = {
  async lister(p: ParamsProfessionnels): Promise<PageProfessionnels> {
    const { data } = await apiClient.get("/admin/professionnels", {
      params: {
        q: p.q || undefined,
        statut: p.statut,
        metier: p.metier === "TOUS" ? undefined : p.metier,
        page: p.page,
        taille: p.taille,
      },
    });
    return data;
  },
  async compteurs(): Promise<CompteursProfessionnels> {
    const { data } = await apiClient.get("/admin/professionnels/compteurs");
    return data;
  },
  async detail(id: string): Promise<ProfessionnelAdminDetail> {
    const { data } = await apiClient.get(`/admin/professionnels/${id}`);
    return data;
  },
  async lienDocument(id: string, documentId: string): Promise<{ url: string }> {
    const { data } = await apiClient.get(`/admin/professionnels/${id}/documents/${documentId}/telecharger`);
    return data;
  },
  async motifs(type: TypeMotifPro): Promise<MotifAdmin[]> {
    const { data } = await apiClient.get("/admin/motifs", { params: { type } });
    return data;
  },
  async desactiver(id: string, payload: ChangementStatutProPayload) {
    const { data } = await apiClient.post(`/admin/professionnels/${id}/desactiver`, payload);
    return data as { statutCompte: string; dossiersEnCours: number };
  },
  async reactiver(id: string, payload: ChangementStatutProPayload) {
    const { data } = await apiClient.post(`/admin/professionnels/${id}/reactiver`, payload);
    return data as { statutCompte: string };
  },
  async approuver(dossierId: string, commentaire?: string) {
    const { data } = await apiClient.post(`/admin/dossiers-pro/${dossierId}/approuver`, commentaire ? { commentaire } : undefined);
    return data;
  },
  async rejeter(dossierId: string, payload: RefusDossierPayload) {
    const { data } = await apiClient.post(`/admin/dossiers-pro/${dossierId}/rejeter`, payload);
    return data;
  },
};

export type ProfessionnelsAdminApi = typeof professionnelsAdminApi;