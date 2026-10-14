import { useQuery } from "@tanstack/react-query";
import { demandesService } from "../service/demandesService";

const POLL_MS = 5000;
const STATUTS_FINAUX = ["ANNULEE", "TERMINEE", "REFUSEE"];
const ETAPES_FINALES = ["ACCEPTEE", "AUCUN_PROFESSIONNEL"];

export function useSuiviDemande(id: string | undefined) {
  return useQuery({
    queryKey: ["demandes", "suivi", id],
    queryFn: () => demandesService.suivi(id!),
    enabled: !!id,
    // On s'arrête dès qu'un professionnel a accepté ou que la demande est close
    refetchInterval: (query) => {
      const d = query.state.data;
      if (!d) return POLL_MS;
      return ETAPES_FINALES.includes(d.etape) ||
        STATUTS_FINAUX.includes(d.statut)
        ? false
        : POLL_MS;
    },
    refetchIntervalInBackground: false,
  });
}