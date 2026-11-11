import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { abonnementsAdminApi } from "../api/abonnementsAdminApi";
import type { ParamsAbonnements, PaiementPayload } from "../types/abonnements.types";

export const ABONNEMENTS_ADMIN_KEY = ["admin", "abonnements"] as const;

export function useAbonnementsAdmin(params: ParamsAbonnements) {
  return useQuery({
    queryKey: [...ABONNEMENTS_ADMIN_KEY, "liste", params],
    queryFn: () => abonnementsAdminApi.lister(params),
    placeholderData: keepPreviousData,
  });
}

export function useCompteursAbonnements() {
  return useQuery({
    queryKey: [...ABONNEMENTS_ADMIN_KEY, "compteurs"],
    queryFn: abonnementsAdminApi.compteurs,
  });
}

/**
 * Un paiement change l'abonnement, peut réactiver le compte du professionnel (liste et fiche
 * Professionnels) et les indicateurs du tableau de bord. On rafraîchit tout, même en cas d'échec :
 * un 409 « déjà enregistré » signifie que l'écran affichait un état dépassé.
 */
export function useEnregistrerPaiement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ professionnelId, payload }: { professionnelId: string; payload: PaiementPayload }) =>
      abonnementsAdminApi.enregistrerPaiement(professionnelId, payload),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ABONNEMENTS_ADMIN_KEY });
      qc.invalidateQueries({ queryKey: ["admin", "professionnels"] });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}