export type Periode = "7j" | "30j";

/** Valeurs envoyées par le backend (enum NiveauUrgence) */
export type NiveauUrgence = "CRITIQUE" | "URGENT" | "NORMAL";

export type StatutSollicitation =
  | "EN_ATTENTE"
  | "ACCEPTEE"
  | "REFUSEE"
  | "EXPIREE";

export interface SollicitationResume {
  id: string;
  demandeId: string;
  reference: string;
  /** null si la demande n'a pas de niveau : traité comme NORMAL à l'affichage */
  niveauUrgence: NiveauUrgence | null;
  matiere: string | null;
  extrait: string | null;
  typeSaisie: "VOCAL" | "TEXTE" | null;
  dureeAudioSecondes: number | null;
  libelleLocalisation: string | null;
  /** null si la position du professionnel ou du citoyen manque */
  distanceKm: number | null;
  /** 0 à 100, calculé par le serveur */
  scoreCorrespondance: number | null;
  /** Dates sans fuseau (UTC) : toujours lire avec parseDateServeur */
  recueLe: string;
  expireLe: string;
  /** null dès que la demande n'est plus EN_ATTENTE */
  secondesRestantes: number | null;
  statut: StatutSollicitation;
  /** Nom abrégé tant que la demande n'est pas acceptée */
  citoyen: { affichage: string | null };
}

export interface PointEvolution {
  date: string;
  total: number;
}

export interface TableauDeBord {
  disponible: boolean;
  demandesRecues: { total: number; variationPourcent: number | null };
  dossiersEnCours: number;
  tauxAcceptation: number | null;
  delaiMoyenReponseSecondes: number | null;
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
  /** Présent dans la spec, absent de la réponse actuelle du backend */
  conversationId?: string;
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

/** Réponse de PUT /pro/disponibilite */
export interface DisponibiliteResultat {
  disponible: boolean;
  derniereActivite: string;
}