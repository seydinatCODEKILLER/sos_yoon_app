import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { professionnelsAdminService } from "../lib/professionnelsAdminService";
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
    queryFn: () => professionnelsAdminService.lister(params),
    placeholderData: keepPreviousData,
  });
}

export function useCompteursProfessionnels() {
  return useQuery({
    queryKey: [...PROFESSIONNELS_ADMIN_KEY, "compteurs"],
    queryFn: () => professionnelsAdminService.compteurs(),
  });
}

export function useDetailProfessionnel(id: string | undefined) {
  return useQuery({
    queryKey: [...PROFESSIONNELS_ADMIN_KEY, "detail", id],
    queryFn: () => professionnelsAdminService.detail(id as string),
    enabled: !!id,
  });
}

export function useMotifsPro(type: TypeMotifPro) {
  return useQuery({
    queryKey: ["admin", "motifs", type],
    queryFn: () => professionnelsAdminService.motifs(type),
    staleTime: 10 * 60 * 1000,
  });
}

function useInvalidation() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: PROFESSIONNELS_ADMIN_KEY });
    qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };
}

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
        ? professionnelsAdminService.desactiver(id, payload)
        : professionnelsAdminService.reactiver(id, payload),
    onSuccess: invalider,
  });
}

export function useApprouverDossier() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: (dossierId: string) => professionnelsAdminService.approuver(dossierId),
    onSuccess: invalider,
  });
}

export function useRejeterDossier() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: ({ dossierId, payload }: { dossierId: string; payload: RefusDossierPayload }) =>
      professionnelsAdminService.rejeter(dossierId, payload),
    onSuccess: invalider,
  });
}