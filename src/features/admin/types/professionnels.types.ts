import type { MotifAdmin } from "./utilisateurs.types";

export type { MotifAdmin };

export type TypeProfession = "AVOCAT" | "HUISSIER" | "NOTAIRE" | "JURISTE_CONSEIL";
export type StatutCompteProfessionnel = "ACTIF" | "EN_ATTENTE_VALIDATION" | "SUSPENDU_ADMIN";
export type StatutDossier = "EN_ATTENTE" | "APPROUVE" | "REJETE";
export type StatutAffichagePro = "VALIDE" | "EN_ATTENTE" | "SUSPENDU" | "REFUSE";
export type FiltreStatutPro = "TOUS" | "EN_ATTENTE" | "VALIDE" | "SUSPENDU_OU_REJETE";
export type FiltreMetier = TypeProfession | "TOUS";
export type TypeDocument = "CARTE_PRO" | "DIPLOME" | "PIECE_IDENTITE";
export type TypeMotifPro = "DESACTIVATION_PRO" | "REACTIVATION_PRO" | "REFUS_DOSSIER";

export interface ProfessionnelAdmin {
  id: string;
  nomComplet: string;
  typeProfession: TypeProfession;
  specialiteDominante: string;
  telephone: string;
  email: string | null;
  disponible: boolean;
  statutCompte: StatutCompteProfessionnel;
  statutDossier: StatutDossier;
  nouveau: boolean;
  dateInscription: string;
}

export interface ParamsProfessionnels {
  q: string;
  statut: FiltreStatutPro;
  metier: FiltreMetier;
  page: number; // 0-indexé, comme l'API
  taille: number;
}

export interface PageProfessionnels {
  contenu: ProfessionnelAdmin[];
  page: number;
  taille: number;
  totalElements: number;
  totalPages: number;
}

export interface CompteursProfessionnels {
  total: number;
  enAttente: number;
  actifs: number;
  suspendusOuRefuses: number;
  // Proposés pour les notes des cartes (à ajouter à l'API)
  nouveauxCeMois?: number;
  refuses?: number;
  suspendus?: number;
}

export interface DocumentDossier {
  id: string;
  type: TypeDocument;
  nomFichier: string;
  tailleOctets: number;
  statut: "EN_ATTENTE" | "ACCEPTE" | "REJETE";
}

export interface DossierInscription {
  id: string;
  reference: string;
  statut: StatutDossier;
  dateSoumission: string;
  nombreSoumissions: number;
  declarationHonneurAcceptee: boolean;
  dateDeclarationHonneur: string | null;
  documents: DocumentDossier[];
}

export interface ProfessionnelAdminDetail {
  id: string;
  prenom: string;
  nom: string;
  typeProfession: TypeProfession;
  telephone: string;
  email: string | null;
  emailVerifie: boolean;
  matricule: string | null;
  specialites: { libelle: string; dominante: boolean }[];
  zone: string;
  dossierInscription: DossierInscription;
  abonnement: { statut: string; finEssai?: string } | null;
  statutCompte: StatutCompteProfessionnel;
}

/** Ce dont les fenêtres ont besoin pour désactiver ou réactiver. */
export interface CiblePro {
  id: string;
  nomComplet: string;
  email: string | null;
  suspendu: boolean;
}

export interface CibleRefus {
  dossierId: string;
  nomComplet: string;
  documents: DocumentDossier[];
}

export interface ChangementStatutProPayload {
  motifId: string;
  observations: string;
}

export interface RefusDossierPayload {
  motifId: string;
  pieceEnCause: TypeDocument;
  commentaire: string;
}