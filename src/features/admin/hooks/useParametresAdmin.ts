import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parametresAdminApi } from "../api/parametresAdminApi";
import type { ParametreAdmin } from "../types/parametres.types";

export const PARAMETRES_ADMIN_KEY = ["admin", "parametres"] as const;
export const PROFIL_KEY = [...PARAMETRES_ADMIN_KEY, "profil"] as const;
export const SESSIONS_KEY = [...PARAMETRES_ADMIN_KEY, "sessions"] as const;
export const PLATEFORME_KEY = [...PARAMETRES_ADMIN_KEY, "plateforme"] as const;

export function useProfilAdmin() {
  return useQuery({ queryKey: PROFIL_KEY, queryFn: parametresAdminApi.profil });
}

export function useModifierProfilAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: parametresAdminApi.modifierProfil,
    onSuccess: (profil) => qc.setQueryData(PROFIL_KEY, profil),
  });
}

export function useChangerMotDePasseAdmin() {
  return useMutation({ mutationFn: parametresAdminApi.changerMotDePasse });
}

/**
 * Les identifiants de session changent à chaque renouvellement du jeton (rotation) : on recharge
 * donc la liste en revenant sur l'onglet, et après chaque action, même en cas d'échec.
 */
export function useSessionsAdmin() {
  return useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: parametresAdminApi.sessions,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useDeconnecterSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: parametresAdminApi.deconnecterSession,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: SESSIONS_KEY });
      qc.invalidateQueries({ queryKey: ["admin", "audit"] });
    },
  });
}

export function useDeconnecterAutresSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: parametresAdminApi.deconnecterAutresSessions,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: SESSIONS_KEY });
      qc.invalidateQueries({ queryKey: ["admin", "audit"] });
    },
  });
}

export function useParametresPlateforme() {
  return useQuery({ queryKey: PLATEFORME_KEY, queryFn: parametresAdminApi.parametres });
}

/**
 * Un montant ou une durée modifiés se retrouvent dans les abonnements et la fiche des
 * professionnels (mensualité), et l'opération est inscrite au journal d'audit.
 */
export function useModifierParametre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cle, valeur }: { cle: string; valeur: string }) => parametresAdminApi.modifierParametre(cle, valeur),
    onSuccess: (modifie) => {
      qc.setQueryData<ParametreAdmin[]>(PLATEFORME_KEY, (liste) =>
        liste?.map((p) => (p.cle === modifie.cle ? { ...p, valeur: modifie.valeur } : p)),
      );
      qc.invalidateQueries({ queryKey: ["admin", "abonnements"] });
      qc.invalidateQueries({ queryKey: ["admin", "professionnels"] });
      qc.invalidateQueries({ queryKey: ["admin", "audit"] });
    },
    onError: () => qc.invalidateQueries({ queryKey: PLATEFORME_KEY }),
  });
}