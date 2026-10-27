import { apiClient } from "@/shared/lib/apiClient";
import type {
  ClotureResultat,
  CompteursDossiers,
  DossierDetail,
  FiltreDossiers,
  PageDossiers,
} from "../types/dossier.types";

export interface DossiersApi {
  lister(filtre: FiltreDossiers, q: string, page: number, taille: number): Promise<PageDossiers>;
  compteurs(): Promise<CompteursDossiers>;
  detail(demandeId: string): Promise<DossierDetail>;
  changerStatut(demandeId: string, statut: "EN_COURS" | "EN_ATTENTE_CLIENT"): Promise<void>;
  cloturer(demandeId: string, commentaire: string): Promise<ClotureResultat>;
}

export const dossiersApi: DossiersApi = {
  async lister(filtre, q, page, taille) {
    const { data } = await apiClient.get<PageDossiers>("/pro/dossiers", {
      params: { statut: filtre, q: q || undefined, page, taille },
    });
    return data;
  },

  async compteurs() {
    const { data } = await apiClient.get<CompteursDossiers>("/pro/dossiers/compteurs");
    return data;
  },

  async detail(demandeId) {
    const { data } = await apiClient.get<DossierDetail>(`/pro/dossiers/${demandeId}`);
    return data;
  },

  async changerStatut(demandeId, statut) {
    await apiClient.put(`/pro/dossiers/${demandeId}/statut`, { statutDossier: statut });
  },

  async cloturer(demandeId, commentaire) {
    const form = new FormData();
    if (commentaire) form.append("commentaire", commentaire);
    const { data } = await apiClient.post<ClotureResultat>(
      `/pro/dossiers/${demandeId}/cloturer`,
      form,
    );
    return data;
  },
};