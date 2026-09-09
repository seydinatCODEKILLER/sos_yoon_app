import type { DemandeStatut } from "../types/demande.types";

export const STATUT_LABELS: Record<DemandeStatut, string> = {
  ENVOYEE: "Envoyée",
  ANALYSE_EN_COURS: "Analyse en cours",
  RECHERCHE_PROFESSIONNEL: "Recherche en cours",
  EN_ATTENTE_ACCEPTATION: "Professionnel trouvé",
};

export const STATUT_BADGE_STYLES: Record<DemandeStatut, string> = {
  ENVOYEE: "bg-muted text-muted-foreground",
  ANALYSE_EN_COURS: "bg-amber-100 text-amber-700",
  RECHERCHE_PROFESSIONNEL: "bg-amber-100 text-amber-700",
  EN_ATTENTE_ACCEPTATION: "bg-signal/15 text-signal",
};

// ⚠️ À étendre dès que le backend expose les statuts post-acceptation
// (voir la même note dans lib/statutSteps.ts)