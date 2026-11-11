import { apiClient } from "@/shared/lib/apiClient";
import type {
  CompteursAbonnements,
  PageAbonnements,
  PaiementPayload,
  ParamsAbonnements,
  ReponsePaiement,
} from "../types/abonnements.types";

/** Spec 13.31 (+ compteurs) et 13.32. */
export const abonnementsAdminApi = {
  async lister(p: ParamsAbonnements): Promise<PageAbonnements> {
    const { data } = await apiClient.get<PageAbonnements>("/admin/abonnements", {
      params: {
        q: p.q || undefined,
        statut: p.statut === "TOUS" ? undefined : p.statut,
        page: p.page,
        taille: p.taille,
      },
    });
    return data;
  },

  async compteurs(): Promise<CompteursAbonnements> {
    const { data } = await apiClient.get<CompteursAbonnements>("/admin/abonnements/compteurs");
    return data;
  },

  /** 201 : prolonge l'abonnement d'un mois et réactive un compte suspendu pour impayé. */
  async enregistrerPaiement(professionnelId: string, payload: PaiementPayload): Promise<ReponsePaiement> {
    const { data } = await apiClient.post<ReponsePaiement>(
      `/admin/professionnels/${professionnelId}/paiements`,
      payload,
    );
    return data;
  },
};