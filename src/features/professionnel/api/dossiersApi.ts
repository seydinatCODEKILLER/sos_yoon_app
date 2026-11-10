import { apiClient } from "@/shared/lib/apiClient";
import type {
  ClotureDonnees,
  ClotureResultat,
  CompteursDossiers,
  DossierDetail,
  FichierDepose,
  FiltreDossiers,
  PageDossiers,
  StatutDossier,
} from "../types/dossier.types";

/** Dossiers du professionnel : spec 11.12 à 11.17 (portée COMPLET) */
export const dossiersApi = {
  async lister(filtre: FiltreDossiers, q: string, page: number, taille: number) {
    const { data } = await apiClient.get<PageDossiers>("/pro/dossiers", {
      params: { statut: filtre, q: q || undefined, page, taille },
    });
    return data;
  },

  async compteurs() {
    const { data } = await apiClient.get<CompteursDossiers>("/pro/dossiers/compteurs");
    return data;
  },

  /** 403 ACCES_REFUSE si le dossier appartient à un autre professionnel, 404 INTROUVABLE */
  async detail(demandeId: string) {
    const { data } = await apiClient.get<DossierDetail>(`/pro/dossiers/${demandeId}`);
    return data;
  },

  async documents(demandeId: string) {
    const { data } = await apiClient.get<FichierDepose[]>(`/pro/dossiers/${demandeId}/documents`);
    return data;
  },

  /**
   * Le corps s'appelle statutDossier (et non statut). 422 STATUT_INVALIDE pour CLOTURE :
   * la clôture passe par cloturer().
   */
  async changerStatut(demandeId: string, statut: Exclude<StatutDossier, "CLOTURE">) {
    const { data } = await apiClient.put<{ statutDossier: StatutDossier }>(
      `/pro/dossiers/${demandeId}/statut`,
      { statutDossier: statut },
    );
    return data;
  },

  /**
   * Le backend n'accepte que du multipart/form-data (du JSON donnerait une 415).
   * 409 DOSSIER_DEJA_CLOTURE ; 400 FORMAT_NON_SUPPORTE pour un fichier hors PDF/JPG/PNG.
   */
  async cloturer(demandeId: string, { commentaire, compteRendu }: ClotureDonnees) {
    const form = new FormData();
    form.append("commentaire", commentaire);
    if (compteRendu) form.append("compteRendu", compteRendu);
    const { data } = await apiClient.post<ClotureResultat>(
      `/pro/dossiers/${demandeId}/cloturer`,
      form,
    );
    return data;
  },
};