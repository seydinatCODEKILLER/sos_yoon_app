import { apiClient } from "@/shared/lib/apiClient";
import type {
  AnnulationDemandePayload,
  CompteursDemandes,
  DemandeAdminDetail,
  MatiereAdmin,
  MotifAdmin,
  PageDemandes,
  ParamsDemandes,
  QualificationPayload,
  ReaffectationPayload,
} from "../types/demandes.types";

/** Spec 13.24 à 13.30 (+ GET /admin/demandes/matieres, nécessaire à la qualification). */
export const demandesAdminApi = {
  async lister(p: ParamsDemandes): Promise<PageDemandes> {
    const { data } = await apiClient.get<PageDemandes>("/admin/demandes", {
      params: {
        q: p.q || undefined,
        statut: p.statut === "TOUS" ? undefined : p.statut,
        du: p.du || undefined,
        au: p.au || undefined,
        page: p.page,
        taille: p.taille,
      },
    });
    return data;
  },

  async compteurs(): Promise<CompteursDemandes> {
    const { data } = await apiClient.get<CompteursDemandes>("/admin/demandes/compteurs");
    return data;
  },

  async detail(id: string): Promise<DemandeAdminDetail> {
    const { data } = await apiClient.get<DemandeAdminDetail>(`/admin/demandes/${id}`);
    return data;
  },

  async matieres(): Promise<MatiereAdmin[]> {
    const { data } = await apiClient.get<MatiereAdmin[]>("/admin/demandes/matieres");
    return data;
  },

  async motifsAnnulation(): Promise<MotifAdmin[]> {
    const { data } = await apiClient.get<MotifAdmin[]>("/admin/motifs", {
      params: { type: "ANNULATION_DEMANDE" },
    });
    return data;
  },

  async qualifier(id: string, payload: QualificationPayload): Promise<DemandeAdminDetail> {
    const { data } = await apiClient.post<DemandeAdminDetail>(`/admin/demandes/${id}/qualifier`, payload);
    return data;
  },

  async reaffecter(id: string, payload: ReaffectationPayload): Promise<DemandeAdminDetail> {
    const { data } = await apiClient.post<DemandeAdminDetail>(`/admin/demandes/${id}/reaffecter`, payload);
    return data;
  },

  /** 202 sans corps. */
  async relancer(id: string): Promise<void> {
    await apiClient.post(`/admin/demandes/${id}/relancer-dispatch`);
  },

  async annuler(id: string, payload: AnnulationDemandePayload): Promise<DemandeAdminDetail> {
    const { data } = await apiClient.post<DemandeAdminDetail>(`/admin/demandes/${id}/annuler`, payload);
    return data;
  },
};