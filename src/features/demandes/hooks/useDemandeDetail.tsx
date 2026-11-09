import { useQuery } from "@tanstack/react-query";
import { demandesService } from "../service/demandesService";

/** Détail d'une demande (spec 8.2) : ce qui a été demandé. Ne change pas, donc pas de rafraîchissement automatique. */
export function useDemandeDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["demandes", "detail", id],
    queryFn: () => demandesService.detail(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}