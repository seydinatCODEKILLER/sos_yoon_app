export type StatutDossier = "EN_COURS" | "EN_ATTENTE_CLIENT" | "CLOTURE";

export type FiltreDossiers = "EN_COURS" | "EN_ATTENTE_CLIENT" | "CLOTURES" | "TOUS";

export interface DossierResume {
  demandeId: string;
  reference: string;
  titre: string | null;
  citoyenNom: string;
  matiere: string;
  statutDossier: StatutDossier;
  dateOuverture: string;
  nombreDocuments: number;
  messagesNonLus: number;
}

export interface Fichier {
  id: string;
  nom: string;
  typeMime: string;
  tailleOctets: number;
  url: string;
  urlExpireLe: string;
}

export interface DossierDetail {
  reference: string;
  titre: string | null;
  statutDossier: StatutDossier;
  citoyen: {
    id: string;
    prenom: string;
    nom: string;
    telephone: string;
    email: string | null;
    commune: string | null;
  };
  demande: {
    description: string | null;
    audio: { url: string; dureeSecondes: number } | null;
    transcription: string | null;
    dateAcceptation: string;
    libelleLocalisation: string;
  };
  conversationId: string | null;
  messagesNonLus: number;
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

export interface ClotureResultat {
  statutDossier: "CLOTURE";
  dateCloture: string;
}