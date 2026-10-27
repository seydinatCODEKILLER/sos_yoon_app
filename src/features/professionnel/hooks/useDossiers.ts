import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dossiersService } from "../lib/dossiersService";
import type { FiltreDossiers } from "../types/dossier.types";

// Même préfixe que l'invalidation faite à l'acceptation d'une demande
export const DOSSIERS_KEY = ["pro", "dossiers"] as const;
export const TAILLE_DOSSIERS = 20;

export function useDossiers(filtre: FiltreDossiers, q: string, page: number) {
  return useQuery({
    queryKey: [...DOSSIERS_KEY, "liste", filtre, q, page],
    queryFn: () => dossiersService.lister(filtre, q, page, TAILLE_DOSSIERS),
    placeholderData: keepPreviousData,
  });
}

export function useCompteursDossiers(actif = true) {
  return useQuery({
    queryKey: [...DOSSIERS_KEY, "compteurs"],
    queryFn: () => dossiersService.compteurs(),
    enabled: actif,
  });
}

export function useDossierDetail(demandeId: string | null) {
  return useQuery({
    queryKey: [...DOSSIERS_KEY, "detail", demandeId],
    queryFn: () => dossiersService.detail(demandeId as string),
    enabled: demandeId !== null,
  });
}

export function useChangerStatutDossier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: "EN_COURS" | "EN_ATTENTE_CLIENT" }) =>
      dossiersService.changerStatut(id, statut),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DOSSIERS_KEY }),
  });
}

export function useCloturerDossier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, commentaire }: { id: string; commentaire: string }) =>
      dossiersService.cloturer(id, commentaire),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DOSSIERS_KEY }),
  });
}