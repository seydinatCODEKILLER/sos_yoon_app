import type { TypeProfession } from "./profil.types";

export type StatutAbonnement = "ESSAI" | "ACTIF" | "EXPIRE";
export type MoyenPaiement = "WAVE" | "ORANGE_MONEY";

export interface AbonnementDetail {
  statut: StatutAbonnement;
  /** Nécessaire au front en portée PAIEMENT (GET /pro/profil y est interdit) */
  typeProfession: TypeProfession;
  /** AAAA-MM-JJ */
  debutEssai: string;
  finEssai: string;
  debutPeriode: string | null;
  finPeriode: string | null;
  joursRestants: number;
  montantMensuel: number;
  devise: "XOF";
  suspendu: boolean;
}

export interface Paiement {
  id: string;
  montant: number;
  moyenPaiement: MoyenPaiement;
  referenceExterne: string | null;
  statut: "EN_ATTENTE" | "REUSSI" | "ECHEC";
  datePaiement: string;
  periodeDebut: string;
  periodeFin: string;
}

export interface PagePaiements {
  contenu: Paiement[];
  page: number;
  taille: number;
  totalElements: number;
  totalPages: number;
}

export interface PayerPayload {
  moyenPaiement: MoyenPaiement;
  telephonePaiement: string;
}

export interface PaiementInitie {
  paiementId: string;
  statut: Paiement["statut"];
  montant: number;
  urlPaiement: string | null;
  instructions: string | null;
  /** Fourni par le mock (simulation) pour afficher la période payée */
  periodeFin?: string;
}