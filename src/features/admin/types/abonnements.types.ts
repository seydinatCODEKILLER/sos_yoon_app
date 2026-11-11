import type { PageAdmin } from "./utilisateurs.types";

export type StatutAbonnement = "ESSAI" | "ACTIF" | "EXPIRE";

/**
 * Valeurs acceptées par GET /admin/abonnements?statut= : les trois statuts de la spec (13.31) plus
 * ECHEANCE_PROCHE (essais et abonnements qui se terminent dans les 7 jours), qui alimente une carte.
 */
export type FiltreAbonnement = "TOUS" | StatutAbonnement | "ECHEANCE_PROCHE";

export type MoyenPaiement = "ORANGE_MONEY" | "WAVE" | "CARTE_BANCAIRE";

/** Ligne de la liste (spec 13.31 + métier, montant mensuel et statut du compte). */
export interface AbonnementAdmin {
  professionnelId: string;
  nomComplet: string | null;
  /** Chaîne ouverte : jamais de plantage sur une valeur inconnue. */
  statut: StatutAbonnement | string | null;
  finEssai: string | null; // yyyy-MM-dd
  /** null pendant l'essai. */
  finPeriode: string | null; // yyyy-MM-dd
  /** Négatif si l'échéance est dépassée. */
  joursRestants: number | null;
  typeProfession?: string | null;
  /** Montant mensuel attendu en XOF : le seul accepté pour un paiement. */
  montantMensuel?: number | null;
  statutCompte?: string | null;
}

export type PageAbonnements = PageAdmin<AbonnementAdmin>;

export interface ParamsAbonnements {
  q: string;
  statut: FiltreAbonnement;
  page: number; // 0-indexé, comme l'API
  taille: number;
}

export interface CompteursAbonnements {
  total: number;
  essai: number;
  actifs: number;
  expires: number;
  echeanceProche: number;
}

export interface PaiementPayload {
  montant: number;
  moyenPaiement: MoyenPaiement;
  referenceExterne?: string;
  /** yyyy-MM-dd */
  datePaiement?: string;
}

/** Réponse 201 de POST /admin/professionnels/{id}/paiements. */
export interface ReponsePaiement {
  paiementId: string;
  abonnement: { statut: string; debutPeriode: string; finPeriode: string };
  statutCompte: string;
}

/** Ce dont le dialogue de paiement a besoin : la liste et la fiche du professionnel lui passent la même chose. */
export interface CiblePaiement {
  professionnelId: string;
  nomComplet: string;
  montantMensuel: number | null;
  /** Échéance actuelle (fin d'essai ou fin de période), yyyy-MM-dd. */
  echeance: string | null;
  statutCompte: string | null;
}