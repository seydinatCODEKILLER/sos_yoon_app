export type StatutDossier = "EN_COURS" | "EN_ATTENTE_CLIENT" | "CLOTURE";

export type FiltreDossiers = "EN_COURS" | "EN_ATTENTE_CLIENT" | "CLOTURES" | "TOUS";

export interface DossierResume {
  demandeId: string;
  reference: string;
  titre: string | null;
  /** null si le compte du citoyen n'est plus disponible */
  citoyenNom: string | null;
  matiere: string | null;
  statutDossier: StatutDossier;
  /** Date et heure sans fuseau (UTC) : lire avec parseDateServeur */
  dateOuverture: string;
  nombreDocuments: number;
  /** Prévu par la spec, non renvoyé tant que la messagerie n'existe pas */
  messagesNonLus?: number;
}

export interface Fichier {
  id: string;
  nom: string;
  typeMime: string;
  tailleOctets: number;
  /** Relative (/uploads/...?exp=…&sig=…) : passer par mediaUrl(). Signée, valable ~1 h */
  url: string;
  urlExpireLe: string;
}

/** Document du dossier (GET /pro/dossiers/{id}/documents) */
export interface FichierDepose extends Fichier {
  deposePar: "CITOYEN" | "PROFESSIONNEL";
  dateDepot: string | null;
}

export interface DossierDetail {
  reference: string;
  titre: string | null;
  statutDossier: StatutDossier;
  citoyen: {
    id: string;
    prenom: string | null;
    nom: string | null;
    telephone: string | null;
    email: string | null;
    commune: string | null;
  } | null;
  demande: {
    description: string | null;
    audio: { url: string | null; dureeSecondes: number | null } | null;
    transcription: string | null;
    dateAcceptation: string | null;
    libelleLocalisation: string | null;
  };
  /** Prévus par la spec, non renvoyés tant que la messagerie n'existe pas */
  conversationId?: string | null;
  messagesNonLus?: number;
  documents: Fichier[];
}

export interface CompteursDossiers {
  enCours: number;
  enAttenteClient: number;
  clotures: number;
  tous: number;
}

export interface PageDossiers {
  contenu: DossierResume[];
  page: number;
  taille: number;
  totalElements: number;
  totalPages: number;
}

export interface ClotureDonnees {
  commentaire: string;
  /** PDF de compte rendu, remis au citoyen (10 Mo maximum) */
  compteRendu: File | null;
}

export interface ClotureResultat {
  statutDossier: "CLOTURE";
  /** Date et heure sans fuseau (UTC) */
  dateCloture: string;
}