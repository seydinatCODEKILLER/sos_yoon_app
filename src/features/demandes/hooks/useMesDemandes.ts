import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { demandesService } from "../service/demandesService";
import type { FiltreDemandes } from "../types/demande.types";
import { estStatutFinal } from "../lib/demandeStatus";

const TAILLE_PAGE = 10;
const POLL_MS = 15_000;

/** Liste « Mes demandes » d'un onglet, par pages de 10 (bouton « Voir plus ») */
export function useMesDemandes(filtre: FiltreDemandes) {
  return useInfiniteQuery({
    queryKey: ["demandes", "liste", filtre],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      demandesService.lister({
        statut: filtre,
        page: pageParam,
        taille: TAILLE_PAGE,
      }),
    getNextPageParam: (derniere) =>
      derniere.page + 1 < derniere.totalPages ? derniere.page + 1 : undefined,
    // Tant qu'une demande est ouverte, la liste se rafraîchit toute seule
    refetchInterval: (query) =>
      query.state.data?.pages.some((p) =>
        p.contenu.some((d) => !estStatutFinal(d.statut)),
      )
        ? POLL_MS
        : false,
  });
}

/** Nombres affichés sur les onglets */
export function useCompteursDemandes() {
  return useQuery({
    queryKey: ["demandes", "compteurs"],
    queryFn: () => demandesService.compteurs(),
    refetchInterval: (query) => (query.state.data?.enCours ? POLL_MS : false),
  });
}