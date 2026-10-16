import { useQuery } from "@tanstack/react-query";
import { profilService } from "../services/profilService";

// Les référentiels bougent très rarement : on les garde pour la session
export function useRegions() {
  return useQuery({
    queryKey: ["referentiels", "regions"],
    queryFn: () => profilService.regions(),
    staleTime: Infinity,
  });
}

export function useCommunesDeRegion(regionId: number | null) {
  return useQuery({
    queryKey: ["referentiels", "communes", regionId],
    queryFn: () => profilService.communesDeRegion(regionId!),
    enabled: regionId !== null,
    staleTime: Infinity,
  });
}