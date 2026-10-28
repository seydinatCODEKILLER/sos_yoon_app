import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dashboardAdminService } from "../lib/dashboardAdminService";
import type { VueEvolution } from "../types/dashboard.types";

export const DASHBOARD_ADMIN_KEY = ["admin", "dashboard"] as const;

export function useTableauDeBordAdmin(actif = true) {
  return useQuery({
    queryKey: DASHBOARD_ADMIN_KEY,
    queryFn: () => dashboardAdminService.tableauDeBord(),
    enabled: actif,
    refetchInterval: 60_000,
  });
}

export function useEvolutionDemandes(vue: VueEvolution) {
  return useQuery({
    queryKey: [...DASHBOARD_ADMIN_KEY, "evolution", vue],
    queryFn: () => dashboardAdminService.evolution(vue),
    placeholderData: keepPreviousData,
  });
}