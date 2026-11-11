import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { utilisateursAdminApi } from "../api/utilisateursAdminApi";
import type {
  ChangementStatutPayload,
  FiltreDemandesUtilisateur,
  ParamsUtilisateurs,
  TypeMotifUtilisateur,
} from "../types/utilisateurs.types";

export const UTILISATEURS_ADMIN_KEY = ["admin", "utilisateurs"] as const;

const TAILLE_HISTORIQUE = 10;

export function useUtilisateursAdmin(params: ParamsUtilisateurs) {
  return useQuery({
    queryKey: [...UTILISATEURS_ADMIN_KEY, "liste", params],
    queryFn: () => utilisateursAdminApi.lister(params),
    placeholderData: keepPreviousData,
  });
}

export function useCompteursUtilisateurs() {
  return useQuery({
    queryKey: [...UTILISATEURS_ADMIN_KEY, "compteurs"],
    queryFn: utilisateursAdminApi.compteurs,
  });
}

export function useDetailUtilisateur(id: string | undefined) {
  return useQuery({
    queryKey: [...UTILISATEURS_ADMIN_KEY, "detail", id],
    queryFn: () => utilisateursAdminApi.detail(id as string),
    enabled: !!id,
  });
}

/** Historique des demandes du citoyen, chargé par tranches (« Voir plus »). */
export function useDemandesUtilisateur(id: string | undefined, statut: FiltreDemandesUtilisateur) {
  return useInfiniteQuery({
    queryKey: [...UTILISATEURS_ADMIN_KEY, "demandes", id, statut],
    queryFn: ({ pageParam }) => utilisateursAdminApi.demandes(id as string, statut, pageParam, TAILLE_HISTORIQUE),
    initialPageParam: 0,
    getNextPageParam: (derniere) => (derniere.page + 1 < derniere.totalPages ? derniere.page + 1 : undefined),
    enabled: !!id,
  });
}

export function useMotifsUtilisateur(type: TypeMotifUtilisateur) {
  return useQuery({
    queryKey: ["admin", "motifs", type],
    queryFn: () => utilisateursAdminApi.motifs(type),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Rafraîchit listes, fiche, compteurs et tableau de bord même en cas d'échec : un 409 signifie que
 * le compte a changé entre-temps, l'écran doit montrer son état réel.
 */
function useInvalidation() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: UTILISATEURS_ADMIN_KEY });
    qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };
}

export function useChangerStatutUtilisateur() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: ({
      id,
      action,
      payload,
    }: {
      id: string;
      action: "desactiver" | "reactiver";
      payload: ChangementStatutPayload;
    }) =>
      action === "desactiver"
        ? utilisateursAdminApi.desactiver(id, payload)
        : utilisateursAdminApi.reactiver(id, payload),
    onSettled: invalider,
  });
}

export function useRevoquerSessions() {
  return useMutation({
    mutationFn: (id: string) => utilisateursAdminApi.revoquerSessions(id),
  });
}