import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { professionnelsAdminApi } from "../api/professionnelsAdminApi";
import type {
  ChangementStatutProPayload,
  ParamsProfessionnels,
  RefusDossierPayload,
  TypeMotifPro,
} from "../types/professionnels.types";

export const PROFESSIONNELS_ADMIN_KEY = ["admin", "professionnels"] as const;

export function useProfessionnelsAdmin(params: ParamsProfessionnels) {
  return useQuery({
    queryKey: [...PROFESSIONNELS_ADMIN_KEY, "liste", params],
    queryFn: () => professionnelsAdminApi.lister(params),
    placeholderData: keepPreviousData,
  });
}

export function useCompteursProfessionnels() {
  return useQuery({
    queryKey: [...PROFESSIONNELS_ADMIN_KEY, "compteurs"],
    queryFn: professionnelsAdminApi.compteurs,
  });
}

export function useDetailProfessionnel(id: string | undefined) {
  return useQuery({
    queryKey: [...PROFESSIONNELS_ADMIN_KEY, "detail", id],
    queryFn: () => professionnelsAdminApi.detail(id as string),
    enabled: !!id,
  });
}

export function useMotifsPro(type: TypeMotifPro) {
  return useQuery({
    queryKey: ["admin", "motifs", type],
    queryFn: () => professionnelsAdminApi.motifs(type),
    staleTime: 10 * 60 * 1000,
  });
}

/** Dossiers à réaffecter après une suspension (spec 13.20). */
export function useDossiersEnCours(id: string | undefined, actif: boolean) {
  return useQuery({
    queryKey: [...PROFESSIONNELS_ADMIN_KEY, "dossiers-en-cours", id],
    queryFn: () => professionnelsAdminApi.dossiersEnCours(id as string),
    enabled: !!id && actif,
  });
}

function useInvalidation() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: PROFESSIONNELS_ADMIN_KEY });
    qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };
}

/**
 * Les mutations rafraîchissent aussi en cas d'échec : un 409 DOSSIER_DEJA_TRAITE signifie
 * qu'un autre administrateur est passé avant, l'écran doit montrer l'état réel.
 */
export function useChangerStatutPro() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: ({
      id,
      action,
      payload,
    }: {
      id: string;
      action: "desactiver" | "reactiver";
      payload: ChangementStatutProPayload;
    }) =>
      action === "desactiver"
        ? professionnelsAdminApi.desactiver(id, payload)
        : professionnelsAdminApi.reactiver(id, payload),
    onSettled: invalider,
  });
}

export function useApprouverDossier() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: (dossierId: string) => professionnelsAdminApi.approuver(dossierId),
    onSettled: invalider,
  });
}

export function useRejeterDossier() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: ({ dossierId, payload }: { dossierId: string; payload: RefusDossierPayload }) =>
      professionnelsAdminApi.rejeter(dossierId, payload),
    onSettled: invalider,
  });
}