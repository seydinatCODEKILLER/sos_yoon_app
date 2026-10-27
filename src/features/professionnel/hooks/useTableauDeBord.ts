import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dashboardService } from "../lib/dashboardService";
import type { Periode } from "../types/dashboard.types";

export const DASHBOARD_KEY = ["pro", "dashboard"] as const;

export function useTableauDeBord(periode: Periode, actif = true) {
  return useQuery({
    queryKey: [...DASHBOARD_KEY, periode],
    queryFn: () => dashboardService.tableauDeBord(periode),
    placeholderData: keepPreviousData,
    enabled: actif,
  });
}