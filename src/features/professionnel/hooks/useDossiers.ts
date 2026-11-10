import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dossiersApi } from "../api/dossiersApi";
import type { ClotureDonnees, FiltreDossiers, StatutDossier } from "../types/dossier.types";
import { DASHBOARD_KEY } from "./useTableauDeBord";

export const DOSSIERS_KEY = ["pro", "dossiers"] as const;
export const TAILLE_DOSSIERS = 20;

export function useDossiers(filtre: FiltreDossiers, q: string, page: number) {
  return useQuery({
    queryKey: [...DOSSIERS_KEY, "liste", filtre, q, page],
    queryFn: () => dossiersApi.lister(filtre, q, page, TAILLE_DOSSIERS),
    placeholderData: keepPreviousData,
  });
}

export function useCompteursDossiers(actif = true) {
  return useQuery({
    queryKey: [...DOSSIERS_KEY, "compteurs"],
    queryFn: () => dossiersApi.compteurs(),
    enabled: actif,
  });
}

export function useDossierDetail(demandeId: string | null) {
  return useQuery({
    queryKey: [...DOSSIERS_KEY, "detail", demandeId],
    queryFn: () => dossiersApi.detail(demandeId as string),
    enabled: demandeId !== null,
    retry: false,
  });
}

/** Les liens des documents sont signés pour environ une heure : on les relit à chaque ouverture */
export function useDocumentsDossier(demandeId: string) {
  return useQuery({
    queryKey: [...DOSSIERS_KEY, "documents", demandeId],
    queryFn: () => dossiersApi.documents(demandeId),
    staleTime: 0,
  });
}

/** Liste, compteurs, détail et le nombre de dossiers en cours du tableau de bord */
function useActualiserDossiers() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: DOSSIERS_KEY }),
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY }),
    ]);
}

export function useChangerStatutDossier() {
  const actualiser = useActualiserDossiers();
  return useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: Exclude<StatutDossier, "CLOTURE"> }) =>
      dossiersApi.changerStatut(id, statut),
    onSuccess: actualiser,
  });
}

export function useCloturerDossier() {
  const actualiser = useActualiserDossiers();
  return useMutation({
    mutationFn: ({ id, ...donnees }: { id: string } & ClotureDonnees) =>
      dossiersApi.cloturer(id, donnees),
    onSuccess: actualiser,
    onError: actualiser,
  });
}