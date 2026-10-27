import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../lib/dashboardService";

export function useAbonnementPro() {
  return useQuery({
    queryKey: ["pro", "abonnement"],
    queryFn: () => dashboardService.abonnement(),
  });
}