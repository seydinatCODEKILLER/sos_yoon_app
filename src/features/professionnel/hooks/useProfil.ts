import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProfilPayload } from "../types/profil.types";
import { profilService } from "../lib/profilService";

export const PROFIL_KEY = ["pro", "profil"] as const;

export function useProfil() {
  return useQuery({ queryKey: PROFIL_KEY, queryFn: () => profilService.obtenir() });
}

export function useMettreAJourProfil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfilPayload) => profilService.mettreAJour(payload),
    onSuccess: (profil) => queryClient.setQueryData(PROFIL_KEY, profil),
  });
}

export function useEnvoyerPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fichier: File) => profilService.envoyerPhoto(fichier),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFIL_KEY }),
  });
}