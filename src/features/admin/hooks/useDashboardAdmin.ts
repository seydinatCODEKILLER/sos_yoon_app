import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dashboardAdminApi } from "../api/dashboardAdminApi";
import type { VueEvolution } from "../types/dashboard.types";

/** Les écrans Demandes, Professionnels, Utilisateurs… invalident cette clé après une action. */
export const DASHBOARD_ADMIN_KEY = ["admin", "dashboard"] as const;

export function useTableauDeBordAdmin(actif = true) {
  return useQuery({
    queryKey: DASHBOARD_ADMIN_KEY,
    queryFn: () => dashboardAdminApi.tableauDeBord(),
    enabled: actif,
    refetchInterval: 60_000,
  });
}

export function useEvolutionDemandes(vue: VueEvolution) {
  return useQuery({
    queryKey: [...DASHBOARD_ADMIN_KEY, "evolution", vue],
    queryFn: () => dashboardAdminApi.evolution(vue),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}