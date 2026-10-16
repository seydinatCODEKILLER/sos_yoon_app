import { useQuery } from "@tanstack/react-query";
import { demandesService } from "../service/demandesService";

const POLL_MS = 15000;

export function useMesDemandes() {
  return useQuery({
    queryKey: ["demandes", "liste"],
    queryFn: () => demandesService.lister(),
    // Tant qu'une demande est en cours, la liste se rafraîchit toute seule
    refetchInterval: (query) =>
      query.state.data?.some((d) => d.statut === "EN_COURS") ? POLL_MS : false,
  });
}