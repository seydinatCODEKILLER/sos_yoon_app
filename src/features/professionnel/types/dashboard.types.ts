export type Periode = "7j" | "30j";

// Seul CRITIQUE figure dans le doc ; les autres valeurs sont supposées.
export type NiveauUrgence = "CRITIQUE" | "ELEVE" | "NORMAL";

export type StatutSollicitation =
  | "EN_ATTENTE"
  | "ACCEPTEE"
  | "REFUSEE"
  | "EXPIREE";

export interface SollicitationResume {
  id: string;
  demandeId: string;
  reference: string;
  niveauUrgence: NiveauUrgence;
  matiere: string;
  extrait: string;
  typeSaisie: "VOCAL" | "TEXTE";
  dureeAudioSecondes: number | null;
  libelleLocalisation: string;
  distanceKm: number;
  scoreCorrespondance: number;
  recueLe: string;
  expireLe: string;
  secondesRestantes: number;
  statut: StatutSollicitation;
  /** Nom abrégé tant que la demande n'est pas acceptée */
  citoyen: { affichage: string };
}

export interface PointEvolution {
  date: string;
  total: number;
}

export interface TableauDeBord {
  disponible: boolean;
  demandesRecues: { total: number; variationPourcent: number };
  dossiersEnCours: number;
  tauxAcceptation: number;
  delaiMoyenReponseSecondes: number;
  sollicitationsEnAttente: number;
  urgentes: SollicitationResume[];
  evolution: PointEvolution[];
}

export type StatutAbonnement = "ESSAI" | "ACTIF" | "EXPIRE";

export interface AbonnementPro {
  statut: StatutAbonnement;
  debutEssai: string | null;
  finEssai: string | null;
  debutPeriode: string | null;
  finPeriode: string | null;
  joursRestants: number | null;
  montantMensuel: number;
  devise: string;
  suspendu: boolean;
}

export interface SollicitationAcceptee {
  sollicitationId: string;
  demandeId: string;
  reference: string;
  statutDossier: string;
  conversationId: string;
  premierContactAvant: string;
  citoyen: {
    id: string;
    prenom: string;
    nom: string;
    telephone: string;
    email: string | null;
    photoUrl: string | null;
    commune: string | null;
  };
}
