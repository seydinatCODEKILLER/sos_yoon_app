import type { MotifAdmin } from "./utilisateurs.types";

export type { MotifAdmin };

export type TypeProfession = "AVOCAT" | "HUISSIER" | "NOTAIRE" | "JURISTE_CONSEIL";
export type StatutCompteProfessionnel = "ACTIF" | "EN_ATTENTE_VALIDATION" | "SUSPENDU_ADMIN";
/** BROUILLON : inscription commencée mais jamais soumise à l'administration. */
export type StatutDossier = "BROUILLON" | "EN_ATTENTE" | "APPROUVE" | "REJETE";
export type StatutAffichagePro = "VALIDE" | "EN_ATTENTE" | "SUSPENDU" | "REFUSE" | "INCOMPLET";
export type FiltreStatutPro = "TOUS" | "EN_ATTENTE" | "VALIDE" | "SUSPENDU_OU_REJETE";
export type FiltreMetier = TypeProfession | "TOUS";
export type TypeDocument = "CARTE_PRO" | "DIPLOME" | "PIECE_IDENTITE";
/** Valeurs de GET /admin/motifs?type= (spec 13.33). */
export type TypeMotifPro = "DESACTIVATION_PRO" | "REACTIVATION_PRO" | "REJET_PRO";

export interface ProfessionnelAdmin {
  id: string;
  nomComplet: string;
  /** Chemin relatif (/uploads/...) ou URL absolue : à passer par mediaUrl(). */
  photoUrl: string | null;
  typeProfession: TypeProfession;
  specialiteDominante: string | null;
  telephone: string;
  email: string | null;
  disponible: boolean | null;
  statutCompte: StatutCompteProfessionnel;
  /** null tant que le professionnel n'a créé aucun dossier. */
  statutDossier: StatutDossier | null;
  nouveau: boolean;
  dateInscription: string | null;
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
  // Prévus par la spec (13.15) mais pas encore émis par le backend : toujours optionnels.
  nouveauxCeMois?: number;
  refuses?: number;
  suspendus?: number;
}

export interface DocumentDossier {
  id: string;
  type: TypeDocument;
  nomFichier: string;
  tailleOctets: number | null;
  statut: "EN_ATTENTE" | "ACCEPTE" | "REJETE" | null;
}

export interface DossierInscription {
  id: string;
  reference: string;
  statut: StatutDossier;
  dateSoumission: string | null;
  nombreSoumissions: number | null;
  declarationHonneurAcceptee: boolean | null;
  dateDeclarationHonneur: string | null;
  documents: DocumentDossier[];
}

export interface AbonnementAdmin {
  statut: string;
  finEssai: string | null;
  finPeriode: string | null;
  joursRestants: number | null;
  /** Montant mensuel attendu en XOF. Absent sur un backend sans le correctif. */
  montantMensuel?: number | null;
}

export interface ProfessionnelAdminDetail {
  id: string;
  prenom: string | null;
  nom: string | null;
  photoUrl: string | null;
  typeProfession: TypeProfession;
  telephone: string;
  email: string | null;
  emailVerifie: boolean;
  matricule: string | null;
  organisme: string | null;
  nomCabinet: string | null;
  specialites: { libelle: string; dominante: boolean }[];
  zone: string | null;
  /** null si le professionnel n'a jamais créé de dossier. */
  dossierInscription: DossierInscription | null;
  abonnement: AbonnementAdmin | null;
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

/** GET /admin/professionnels/{id}/documents/{documentId}/telecharger : <Fichier> (spec 13.17). */
export interface FichierSigne {
  id: string;
  nom: string;
  typeMime: string | null;
  tailleOctets: number | null;
  /** Relative au backend (/uploads/...?exp&sig) : passer par mediaUrl(). Valable ~1 h. */
  url: string | null;
  urlExpireLe: string | null;
}

/** Réponse de /desactiver (avec dossiersEnCours) et de /reactiver (statutCompte seul). */
export interface ReponseChangementStatut {
  statutCompte: string;
  dossiersEnCours?: number;
}

/** GET /admin/professionnels/{id}/dossiers-en-cours (spec 13.20). */
export interface DossierEnCours {
  demandeId: string;
  reference: string | null;
  titre: string | null;
  citoyen: string | null;
  dateAcceptation: string | null;
}