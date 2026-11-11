import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { demandesAdminApi } from "../api/demandeAdminApi";
import type {
  AnnulationDemandePayload,
  ParamsDemandes,
  QualificationPayload,
  ReaffectationPayload,
} from "../types/demandes.types";

export const DEMANDES_ADMIN_KEY = ["admin", "demandes"] as const;

export function useDemandesAdmin(params: ParamsDemandes) {
  return useQuery({
    queryKey: [...DEMANDES_ADMIN_KEY, "liste", params],
    queryFn: () => demandesAdminApi.lister(params),
    placeholderData: keepPreviousData,
  });
}

export function useCompteursDemandes() {
  return useQuery({
    queryKey: [...DEMANDES_ADMIN_KEY, "compteurs"],
    queryFn: demandesAdminApi.compteurs,
  });
}

export function useDetailDemande(id: string | undefined) {
  return useQuery({
    queryKey: [...DEMANDES_ADMIN_KEY, "detail", id],
    queryFn: () => demandesAdminApi.detail(id as string),
    enabled: !!id,
  });
}

/** Référentiel des matières : change très rarement. */
export function useMatieres(actif: boolean) {
  return useQuery({
    queryKey: ["admin", "matieres"],
    queryFn: demandesAdminApi.matieres,
    enabled: actif,
    staleTime: 10 * 60 * 1000,
  });
}

export function useMotifsAnnulation(actif: boolean) {
  return useQuery({
    queryKey: ["admin", "motifs", "ANNULATION_DEMANDE"],
    queryFn: demandesAdminApi.motifsAnnulation,
    enabled: actif,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Chaque action rafraîchit les listes, la fiche, les compteurs du tableau de bord et les
 * professionnels (dossiers en cours), même en cas d'échec : un 409 signifie que la demande a
 * changé entre-temps, l'écran doit montrer son état réel.
 */
function useInvalidation() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: DEMANDES_ADMIN_KEY });
    qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    qc.invalidateQueries({ queryKey: ["admin", "professionnels"] });
  };
}

export function useQualifierDemande() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: QualificationPayload }) =>
      demandesAdminApi.qualifier(id, payload),
    onSettled: invalider,
  });
}

export function useReaffecterDemande() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReaffectationPayload }) =>
      demandesAdminApi.reaffecter(id, payload),
    onSettled: invalider,
  });
}

export function useRelancerDemande() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: (id: string) => demandesAdminApi.relancer(id),
    onSettled: invalider,
  });
}

export function useAnnulerDemande() {
  const invalider = useInvalidation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AnnulationDemandePayload }) =>
      demandesAdminApi.annuler(id, payload),
    onSettled: invalider,
  });
}