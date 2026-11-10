import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { agendaApi } from "../api/agendaApi";
import { dossiersApi } from "../api/dossiersApi";
import type { RendezVousPayload } from "../types/agenda.types";
import { DOSSIERS_KEY } from "./useDossiers";

export const AGENDA_KEY = ["pro", "agenda"] as const;

export function useAgenda(debut: string, fin: string, actif = true) {
  return useQuery({
    queryKey: [...AGENDA_KEY, debut, fin],
    queryFn: () => agendaApi.lister(debut, fin),
    placeholderData: keepPreviousData,
    enabled: actif,
  });
}

/** Dossiers que l'on peut lier à un rendez-vous (100 au plus, le maximum accepté par le backend) */
export function useDossiersLiables(actif = true) {
  return useQuery({
    queryKey: [...DOSSIERS_KEY, "liables"],
    queryFn: () => dossiersApi.lister("TOUS", "", 0, 100),
    enabled: actif,
    staleTime: 60_000,
  });
}

/** Après une écriture, réussie ou non (ex. 404 : supprimé ailleurs), l'agenda se relit */
function useActualiserAgenda() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: AGENDA_KEY });
}

export function useCreerRendezVous() {
  const actualiser = useActualiserAgenda();
  return useMutation({
    mutationFn: (payload: RendezVousPayload) => agendaApi.creer(payload),
    onSettled: actualiser,
  });
}

export function useModifierRendezVous() {
  const actualiser = useActualiserAgenda();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RendezVousPayload }) =>
      agendaApi.modifier(id, payload),
    onSettled: actualiser,
  });
}

export function useSupprimerRendezVous() {
  const actualiser = useActualiserAgenda();
  return useMutation({
    mutationFn: (id: string) => agendaApi.supprimer(id),
    onSettled: actualiser,
  });
}