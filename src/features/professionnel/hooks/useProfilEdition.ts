import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/authApi";
import type { ChangerMotDePassePayload } from "@/features/auth/types/types";
import { profilApi } from "../api/profilApi";
import type { SpecialitesPayload, ZonePayload } from "../types/profil.types";
import { PROFIL_KEY } from "./useProfil";

export function useMettreAJourSpecialites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SpecialitesPayload) => profilApi.mettreAJourSpecialites(payload),
    onSuccess: (profil) => queryClient.setQueryData(PROFIL_KEY, profil),
  });
}

export function useMettreAJourZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ZonePayload) => profilApi.mettreAJourZone(payload),
    onSuccess: (profil) => queryClient.setQueryData(PROFIL_KEY, profil),
  });
}

/** PUT /auth/mot-de-passe : 400 ANCIEN_MOT_DE_PASSE_INCORRECT ou MOT_DE_PASSE_FAIBLE */
export function useChangerMotDePasse() {
  return useMutation({
    mutationFn: (payload: ChangerMotDePassePayload) => authApi.motDePasse.changer(payload),
  });
}