import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { utilisateursAdminService } from "../lib/utilisateursAdminService";
import type { ChangementStatutPayload, ParamsUtilisateurs, TypeMotif } from "../types/utilisateurs.types";

export const UTILISATEURS_ADMIN_KEY = ["admin", "utilisateurs"] as const;

export function useUtilisateursAdmin(params: ParamsUtilisateurs) {
  return useQuery({
    queryKey: [...UTILISATEURS_ADMIN_KEY, "liste", params],
    queryFn: () => utilisateursAdminService.lister(params),
    placeholderData: keepPreviousData,
  });
}

export function useCompteursUtilisateurs() {
  return useQuery({
    queryKey: [...UTILISATEURS_ADMIN_KEY, "compteurs"],
    queryFn: () => utilisateursAdminService.compteurs(),
  });
}

export function useMotifsAdmin(type: TypeMotif) {
  return useQuery({
    queryKey: ["admin", "motifs", type],
    queryFn: () => utilisateursAdminService.motifs(type),
    staleTime: 10 * 60 * 1000,
  });
}

export function useChangerStatutUtilisateur() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      action,
      payload,
    }: {
      id: string;
      action: "desactiver" | "reactiver";
      payload: ChangementStatutPayload;
    }) =>
      action === "desactiver"
        ? utilisateursAdminService.desactiver(id, payload)
        : utilisateursAdminService.reactiver(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: UTILISATEURS_ADMIN_KEY });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}