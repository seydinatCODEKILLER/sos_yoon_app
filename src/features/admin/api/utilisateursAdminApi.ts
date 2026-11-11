import { apiClient } from "@/shared/lib/apiClient";
import type {
  ChangementStatutPayload,
  CompteursUtilisateurs,
  FiltreDemandesUtilisateur,
  FiltreStatutUtilisateur,
  MotifAdmin,
  PageDemandesUtilisateur,
  PageUtilisateurs,
  ParamsUtilisateurs,
  TypeMotifUtilisateur,
  UtilisateurAdminDetail,
} from "../types/utilisateurs.types";

/** Spec 13.6 à 13.13. */
export const utilisateursAdminApi = {
  async lister(p: ParamsUtilisateurs): Promise<PageUtilisateurs> {
    const { data } = await apiClient.get<PageUtilisateurs>("/admin/utilisateurs", {
      params: {
        q: p.q || undefined,
        statut: p.statut === "TOUS" ? undefined : p.statut,
        page: p.page,
        taille: p.taille,
      },
    });
    return data;
  },

  async compteurs(): Promise<CompteursUtilisateurs> {
    const { data } = await apiClient.get<CompteursUtilisateurs>("/admin/utilisateurs/compteurs");
    return data;
  },

  async detail(id: string): Promise<UtilisateurAdminDetail> {
    const { data } = await apiClient.get<UtilisateurAdminDetail>(`/admin/utilisateurs/${id}`);
    return data;
  },

  async demandes(
    id: string,
    statut: FiltreDemandesUtilisateur,
    page: number,
    taille: number,
  ): Promise<PageDemandesUtilisateur> {
    const { data } = await apiClient.get<PageDemandesUtilisateur>(`/admin/utilisateurs/${id}/demandes`, {
      params: { statut, page, taille },
    });
    return data;
  },

  async motifs(type: TypeMotifUtilisateur): Promise<MotifAdmin[]> {
    const { data } = await apiClient.get<MotifAdmin[]>("/admin/motifs", { params: { type } });
    return data;
  },

  async desactiver(id: string, payload: ChangementStatutPayload): Promise<{ statutCompte: string }> {
    const { data } = await apiClient.post(`/admin/utilisateurs/${id}/desactiver`, payload);
    return data;
  },

  async reactiver(id: string, payload: ChangementStatutPayload): Promise<{ statutCompte: string }> {
    const { data } = await apiClient.post(`/admin/utilisateurs/${id}/reactiver`, payload);
    return data;
  },

  /** 204 sans corps. */
  async revoquerSessions(id: string): Promise<void> {
    await apiClient.post(`/admin/utilisateurs/${id}/revoquer-sessions`);
  },

  /** CSV (séparateur « ; ») des comptes qui correspondent aux filtres, sans pagination. */
  async exporter(q: string, statut: FiltreStatutUtilisateur): Promise<Blob> {
    const { data } = await apiClient.get<Blob>("/admin/utilisateurs/export", {
      params: { q: q || undefined, statut: statut === "TOUS" ? undefined : statut },
      responseType: "blob",
    });
    return data;
  },
};