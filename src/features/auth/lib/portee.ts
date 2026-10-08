import type { Portee, StatutCompte } from "@/types/user.types";

export function porteeFromStatut(statut: StatutCompte): Portee {
  switch (statut) {
    case "ACTIF":
      return "COMPLET";
    case "EMAIL_A_VERIFIER":
    case "INSCRIPTION_EN_COURS":
      return "INSCRIPTION";
    case "EN_ATTENTE_VALIDATION":
    case "REJETE":
      return "DOSSIER";
    case "SUSPENDU_IMPAYE":
      return "PAIEMENT";
    case "SUSPENDU_ADMIN":
      return "AUCUNE";
  }
}