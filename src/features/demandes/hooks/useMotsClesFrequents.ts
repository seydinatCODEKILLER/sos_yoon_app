import { useQuery } from "@tanstack/react-query";
import { demandesService } from "../service/demandesService";

export function useMotsClesFrequents() {
  return useQuery({
    queryKey: ["referentiels", "mots-cles-frequents"],
    queryFn: () => demandesService.motsClesFrequents(),
    staleTime: 60 * 60 * 1000,
  });
}