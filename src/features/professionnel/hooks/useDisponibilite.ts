import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../lib/dashboardService";
import type { TableauDeBord } from "../types/dashboard.types";
import { DASHBOARD_KEY } from "./useTableauDeBord";

export function useDisponibilite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (disponible: boolean) =>
      dashboardService.changerDisponibilite(disponible),
    onSuccess: (_, disponible) => {
      queryClient.setQueriesData<TableauDeBord>(
        { queryKey: DASHBOARD_KEY },
        (ancien) => (ancien ? { ...ancien, disponible } : ancien),
      );
    },
  });
}