import type { DemandeStatut } from "../types/demande.types";

export const STATUT_STEP_INDEX: Record<DemandeStatut, number> = {
  ENVOYEE: 0,
  ANALYSE_EN_COURS: 0,
  RECHERCHE_PROFESSIONNEL: 1,
  EN_ATTENTE_ACCEPTATION: 2,
};

export function getStepIndex(statut: DemandeStatut): number {
  return STATUT_STEP_INDEX[statut] ?? 0;
}

// ⚠️ Les statuts post-acceptation (le professionnel confirme/refuse la
// demande, prend en charge, termine...) ne sont pas encore définis côté
// backend (voir demande.service.js — le flow s'arrête à
// EN_ATTENTE_ACCEPTATION). Cette fonction est à étendre dès que ces
// statuts existent, sinon ils retomberont par défaut sur l'étape 0.