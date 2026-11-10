import type { TypeProfession } from "./profil.types";

export type StatutAbonnement = "ESSAI" | "ACTIF" | "EXPIRE";
export type MoyenPaiement = "WAVE" | "ORANGE_MONEY";

export interface AbonnementDetail {
  statut: StatutAbonnement;
  /** Nécessaire au front en portée PAIEMENT (GET /pro/profil y est interdit) */
  typeProfession: TypeProfession | null;
  /** AAAA-MM-JJ ; null si l'essai n'a jamais été ouvert */
  debutEssai: string | null;
  finEssai: string | null;
  debutPeriode: string | null;
  finPeriode: string | null;
  /** null quand aucune échéance n'est connue */
  joursRestants: number | null;
  montantMensuel: number;
  devise: "XOF";
  suspendu: boolean;
}

export interface Paiement {
  id: string;
  montant: number;
  moyenPaiement: MoyenPaiement | "CARTE_BANCAIRE" | null;
  referenceExterne: string | null;
  statut: "EN_ATTENTE" | "REUSSI" | "ECHEC";
  /** Date et heure sans fuseau (UTC) */
  datePaiement: string;
  /** null tant que le paiement n'est pas confirmé */
  periodeDebut: string | null;
  periodeFin: string | null;
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
  /** Format international : +221771234567 */
  telephonePaiement: string;
}

export interface PaiementInitie {
  paiementId: string;
  statut: Paiement["statut"];
  montant: number;
  /** Page du prestataire où le professionnel valide le paiement */
  urlPaiement: string | null;
  instructions: string | null;
  /** Fourni par le mock (simulation) pour afficher la période payée */
  periodeFin?: string;
}