import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { refreshSession } from "@/shared/lib/refreshToken";
import type { ProfilPayload } from "../types/profil.types";
import { profilService } from "../lib/profilService";

export const PROFIL_KEY = ["pro", "profil"] as const;

/**
 * Le nom et la photo de l'en-tête de l'application viennent de la session :
 * on la relit après une modification pour qu'ils suivent.
 */
function relireSession() {
  void refreshSession().catch(() => {
    /* sans effet sur le profil : l'en-tête se mettra à jour à la prochaine connexion */
  });
}

export function useProfil() {
  return useQuery({ queryKey: PROFIL_KEY, queryFn: () => profilService.obtenir() });
}

export function useMettreAJourProfil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfilPayload) => profilService.mettreAJour(payload),
    onSuccess: (profil) => {
      queryClient.setQueryData(PROFIL_KEY, profil);
      relireSession();
    },
  });
}

export function useEnvoyerPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fichier: File) => profilService.envoyerPhoto(fichier),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFIL_KEY });
      relireSession();
    },
  });
}