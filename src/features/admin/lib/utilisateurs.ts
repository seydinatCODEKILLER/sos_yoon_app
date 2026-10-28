import type { StatutCompteUtilisateur } from "../types/utilisateurs.types";

export const estActif = (s: StatutCompteUtilisateur) => s === "ACTIF";

export function formaterDateInscription(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Seuil à partir duquel le nombre de demandes est mis en avant. */
export const SEUIL_DEMANDES_ELEVE = 5;

export const LIBELLE_DEMANDES = (n: number) =>
  n === 0 ? "0 demande" : `${n} demande${n > 1 ? "s" : ""}`;