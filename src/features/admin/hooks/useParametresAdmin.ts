import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parametresAdminService } from "../lib/parametresAdminService";
import type { ProfilAdminPayload } from "../types/parametres.types";

export const PARAMETRES_ADMIN_KEY = ["admin", "parametres"] as const;
const PROFIL_KEY = [...PARAMETRES_ADMIN_KEY, "profil"] as const;
const SESSIONS_KEY = [...PARAMETRES_ADMIN_KEY, "sessions"] as const;

export function useProfilAdmin() {
  return useQuery({ queryKey: PROFIL_KEY, queryFn: () => parametresAdminService.profil() });
}

export function useModifierProfilAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: ProfilAdminPayload) => parametresAdminService.modifierProfil(p),
    onSuccess: (profil) => qc.setQueryData(PROFIL_KEY, profil),
  });
}

export function useSessionsAdmin() {
  return useQuery({ queryKey: SESSIONS_KEY, queryFn: () => parametresAdminService.sessions() });
}

export function useDeconnecterSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => parametresAdminService.deconnecterSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SESSIONS_KEY }),
  });
}

export function useDeconnecterAutresSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => parametresAdminService.deconnecterAutresSessions(),
    onSuccess: () => qc.invalidateQueries({ queryKey: SESSIONS_KEY }),
  });
}

export function useChangerMotDePasseAdmin() {
  return useMutation({
    mutationFn: (p: { ancienMotDePasse: string; nouveauMotDePasse: string }) =>
      parametresAdminService.changerMotDePasse(p),
  });
}