import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { agendaService } from "../lib/agendaService";
import type { RendezVousPayload } from "../types/agenda.types";

export const AGENDA_KEY = ["pro", "agenda"] as const;

export function useAgenda(debut: string, fin: string, actif = true) {
  return useQuery({
    queryKey: [...AGENDA_KEY, debut, fin],
    queryFn: () => agendaService.lister(debut, fin),
    placeholderData: keepPreviousData,
    enabled: actif,
  });
}

export function useCreerRendezVous() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RendezVousPayload) => agendaService.creer(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AGENDA_KEY }),
  });
}

export function useModifierRendezVous() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RendezVousPayload }) =>
      agendaService.modifier(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AGENDA_KEY }),
  });
}

export function useSupprimerRendezVous() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => agendaService.supprimer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AGENDA_KEY }),
  });
}