import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { avisApi } from "../api/avisApi";
import type { AvisPayload } from "../types/avis.types";
import type { DemandeDetail } from "../types/demande.types";
import { suiviQueryKey } from "./useSuiviDemande";

const detailKey = (id: string) => ["demandes", "detail", id] as const;

/** Le lien est signé pour environ une heure : on le relit s'il date de plus de 5 minutes */
export function useCompteRendu(demandeId: string, actif: boolean) {
  return useQuery({
    queryKey: ["demandes", "compte-rendu", demandeId],
    queryFn: () => avisApi.compteRendu(demandeId),
    enabled: actif,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useDonnerAvis(demandeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AvisPayload) => avisApi.donnerAvis(demandeId, payload),
    onSuccess: () => {
      queryClient.setQueryData<DemandeDetail>(detailKey(demandeId), (d) =>
        d ? { ...d, avisDonne: true } : d,
      );
      // La liste (« Noter ») et la note du professionnel se mettent à jour
      void queryClient.invalidateQueries({ queryKey: ["demandes"] });
      void queryClient.invalidateQueries({ queryKey: suiviQueryKey(demandeId) });
    },
    // 409 AVIS_DEJA_DONNE / DEMANDE_NON_TERMINEE : l'écran reprend l'état réel
    onError: () => queryClient.invalidateQueries({ queryKey: detailKey(demandeId) }),
  });
}