import { useQuery } from "@tanstack/react-query";
import { demandesService } from "../service/demandesService";
import { demandeErrorCode } from "../lib/demandeErrors";
import { estStatutFinal } from "../lib/demandeStatus";

export const suiviQueryKey = (id: string | undefined) =>
  ["demandes", "suivi", id] as const;

/**
 * Suivi d'une demande (spec 8.3), rafraîchi toutes les 5 s tant que la recherche est en cours.
 * - une fois un professionnel affecté : toutes les 15 s (on attend seulement la clôture)
 * - demande close : plus d'interrogation
 */
export function useSuiviDemande(id: string | undefined) {
  return useQuery({
    queryKey: suiviQueryKey(id),
    queryFn: () => demandesService.suivi(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const suivi = query.state.data;
      if (!suivi) return 5_000;
      if (estStatutFinal(suivi.statut)) return false;
      return suivi.professionnelAffecte ? 15_000 : 5_000;
    },
    // Une demande introuvable (404) ne se règle pas en réessayant
    retry: (nbEchecs, error) =>
      demandeErrorCode(error) !== "INTROUVABLE" && nbEchecs < 2,
  });
}