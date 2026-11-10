import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../lib/dashboardService";
import { DASHBOARD_KEY } from "./useTableauDeBord";
import { SOLLICITATIONS_KEY } from "./useSollicitations";

export function useAccepterSollicitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dashboardService.accepterSollicitation(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: SOLLICITATIONS_KEY });

      queryClient.invalidateQueries({ queryKey: ["pro", "dossiers"] });
    },
  });
}