import type { StatutDemande } from "../types/demande.types";

const FINAUX: ReadonlySet<StatutDemande> = new Set([
  "TERMINEE",
  "ANNULEE",
  "EXPIRE_FALLBACK",
  "REFUSEE",
]);

/** Demande close : plus rien à suivre, on arrête d'interroger le serveur */
export const estStatutFinal = (statut: StatutDemande) => FINAUX.has(statut);