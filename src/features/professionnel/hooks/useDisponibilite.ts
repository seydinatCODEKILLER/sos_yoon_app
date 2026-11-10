import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { dashboardService } from "../lib/dashboardService";
import { messageEspacePro } from "../lib/erreurSollicitation";
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
    onError: (error) =>
      toast.error(
        "Disponibilité inchangée",
        messageEspacePro(error, "Réessayez dans un instant."),
      ),
  });
}