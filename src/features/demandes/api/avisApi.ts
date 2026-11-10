import { apiClient } from "@/shared/lib/apiClient";
import type { AvisEnregistre, AvisPayload, CompteRendu } from "../types/avis.types";

/** Fin de demande côté particulier : avis (8.9) et compte rendu (8.8) */
export const avisApi = {
  /**
   * 409 AVIS_DEJA_DONNE, 409 DEMANDE_NON_TERMINEE,
   * 422 NOTE_INVALIDE si la note n'est pas comprise entre 1 et 5.
   */
  async donnerAvis(demandeId: string, payload: AvisPayload) {
    const { data } = await apiClient.post<AvisEnregistre>(`/demandes/${demandeId}/avis`, payload);
    return data;
  },

  /** 404 si le professionnel n'a déposé aucun compte rendu */
  async compteRendu(demandeId: string) {
    const { data } = await apiClient.get<CompteRendu>(`/demandes/${demandeId}/compte-rendu`);
    return data;
  },
};