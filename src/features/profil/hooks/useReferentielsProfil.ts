import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { profilService } from "../services/profilService";

// Les régions bougent très rarement : on les garde pour la session.
// `enabled` permet de ne les charger que quand on en a besoin (ex. repli de localisation d'une demande).
export function useRegions(enabled = true) {
  return useQuery({
    queryKey: ["referentiels", "regions"],
    queryFn: () => profilService.regions(),
    staleTime: Infinity,
    enabled,
  });
}

/**
 * Zones d'une région, avec recherche côté serveur (2 caractères minimum).
 * Sans recherche : les 50 premières zones de la région.
 */
export function useZones(regionId: string | null, recherche: string) {
  const q = recherche.trim().length >= 2 ? recherche.trim() : "";
  return useQuery({
    queryKey: ["referentiels", "zones", regionId, q],
    queryFn: () => profilService.zones(regionId!, q || undefined),
    enabled: regionId !== null,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}