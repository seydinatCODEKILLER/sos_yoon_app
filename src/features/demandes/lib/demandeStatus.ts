import type { DemandeStatut } from "@/features/demandes/types/demande.types";

export const DEMANDE_STATUS_LABELS: Record<
  DemandeStatut,
  { label: string; accent: "ink" | "brass" | "signal" }
> = {
  ENVOYEE: { label: "Demande envoyée", accent: "ink" },
  ANALYSE_EN_COURS: { label: "Analyse en cours", accent: "brass" },
  RECHERCHE_PROFESSIONNEL: {
    label: "Recherche d'un professionnel",
    accent: "signal",
  },
  EN_ATTENTE_ACCEPTATION: {
    label: "En attente d'acceptation",
    accent: "signal",
  },
};

// Fallback pour tout statut pas encore connu côté back-end
// (post-matching : accepté, refusé, terminé, annulé...).
export function getDemandeStatusInfo(statut: DemandeStatut) {
  return (
    DEMANDE_STATUS_LABELS[statut] ?? { label: statut, accent: "ink" as const }
  );
}