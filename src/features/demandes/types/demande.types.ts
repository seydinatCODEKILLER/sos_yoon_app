export type TypeSaisie = "TEXTE" | "VOCAL";

export interface MotCleFrequent {
  motCle: string;
  libelle: string;
}

/* ───────────── Création (spec 8.1) ───────────── */

/** Position envoyée avec la demande : latitude et longitude sont obligatoires */
export interface LocalisationPayload {
  latitude: number;
  longitude: number;
  /** Nom du lieu affiché au citoyen */
  libelle: string;
}

export interface CreerDemandeEcritePayload {
  /** Obligatoire, 1 000 caractères max */
  description: string;
  motsCles: string[];
  localisation: LocalisationPayload;
}

/** Demande vocale : audio (webm, mp4 ou ogg ; 5 Mo et 120 s maximum) envoyé dans le champ « fichier » */
export interface CreerDemandeVocalePayload {
  fichier: Blob;
  /** 1 à 120 */
  dureeSecondes: number;
  /** Facultatifs, mais utiles : sans transcription, ils guident la qualification */
  motsCles: string[];
  localisation: LocalisationPayload;
}

/** Réponse 202 de POST /demandes */
export interface DemandeCreee {
  id: string;
  reference: string;
  statut: "ENVOYEE";
  dateEnvoi: string;
  localisation: {
    libelle: string | null;
    rayonKm: number;
    secteur: string | null;
    professionnelsDisponiblesDansZone: boolean;
  };
}

/* ───────────── Statuts ───────────── */

/**
 * Statuts renvoyés par le backend.
 * - ENVOYEE / EN_ATTENTE_TRIAGE / ANALYSEE_IA / EN_DISPATCH : analyse en cours
 * - EN_ATTENTE_ACCEPTATION : un professionnel est sollicité
 * - RECHERCHE_PROFESSIONNEL : plus personne dans la file, transmis à l'équipe SOS Yoon
 * - ACCEPTEE / EN_COURS : un professionnel est affecté
 * - TERMINEE / ANNULEE / EXPIRE_FALLBACK : demande close
 */
export type StatutDemande =
  | "BROUILLON"
  | "ENVOYEE"
  | "EN_ATTENTE_TRIAGE"
  | "ANALYSEE_IA"
  | "EN_DISPATCH"
  | "RECHERCHE_PROFESSIONNEL"
  | "EN_ATTENTE_ACCEPTATION"
  | "ACCEPTEE"
  | "EN_COURS"
  | "TERMINEE"
  | "REFUSEE"
  | "ANNULEE"
  | "EXPIRE_FALLBACK";

export type NiveauUrgence = "URGENT" | "NORMAL" | string;

/* ───────────── Professionnel (spec <ProfessionnelPublic>) ───────────── */

export interface SpecialitePro {
  id: string;
  libelle: string;
  dominante: boolean;
}

export interface ProfessionnelPublic {
  id: string;
  /** "Maître Amadou Diop" */
  nomComplet: string;
  /** "Avocat à la Cour" */
  titre: string | null;
  typeProfession: string | null;
  organisme: string | null;
  matricule: string | null;
  anneesExperience: number | null;
  langues: string[] | null;
  specialites: SpecialitePro[] | null;
  /** Peut être relative (/uploads/...) : toujours passer par mediaUrl() */
  photoUrl: string | null;
  verifie: boolean;
  noteMoyenne: number | null;
  nombreAvis: number | null;
  enLigne: boolean;
  /** "À proximité de vous (Dakar)" */
  proximite: string | null;
  /** Chiffres seulement ("221771234567", pour tel: et wa.me). Présent uniquement pour le professionnel affecté. */
  telephone?: string | null;
}

/* ───────────── Suivi (spec 8.3) ───────────── */

export type CodeEtape =
  | "DEMANDE_ENVOYEE"
  | "SITUATION_ANALYSEE"
  | "PROFESSIONNEL_IDENTIFIE"
  | "DEMANDE_ACCEPTEE"
  | "ECHANGE_EN_DIRECT"
  | "CLOTURE";

export type EtatEtape = "FAIT" | "EN_COURS" | "A_VENIR";

export interface EtapeSuivi {
  code: CodeEtape;
  libelle: string;
  etat: EtatEtape;
  date: string | null;
}

export interface SollicitationSuivi {
  rang: number;
  statut: string;
  /** Présent seulement pour la sollicitation en cours */
  expireLe?: string | null;
  professionnel: ProfessionnelPublic | null;
}

export interface SuiviDemande {
  reference: string;
  titre: string | null;
  statut: StatutDemande;
  niveauUrgence: NiveauUrgence | null;
  etapes: EtapeSuivi[];
  sollicitationEnCours: SollicitationSuivi | null;
  fileReserve: SollicitationSuivi[];
  professionnelAffecte: ProfessionnelPublic | null;
  tempsMoyenMinutes: number | null;
  /** "800 00 12 12" */
  numeroUrgence: string | null;
}

/* ───────────── Détail (spec 8.2) ───────────── */

export interface DemandeAudio {
  url: string;
  dureeSecondes: number;
}

export interface EnvoyerAudioPayload {
  fichier: Blob;
  dureeSecondes: number;
}

export interface DemandeLocalisation {
  libelle: string;
  rayonKm: number;
  latitudeApprox: number | null;
  longitudeApprox: number | null;
}

export interface DemandeDetail {
  id: string;
  reference: string;
  titre: string | null;
  typeSaisie: TypeSaisie;
  description: string | null;
  motsCles: string[] | null;
  audio: DemandeAudio | null;
  transcription: string | null;
  statut: StatutDemande;
  niveauUrgence: NiveauUrgence | null;
  matiere: { id: string | number; libelle: string } | null;
  metiersRequis: string[] | null;
  localisation: DemandeLocalisation | null;
  dateCreation: string;
  dateEnvoi: string | null;
  professionnel: ProfessionnelPublic | null;
  compteRenduDisponible: boolean;
  avisDonne: boolean;
}

/* ───────────── Liste « Mes demandes » (spec 8.4 / 8.5) ───────────── */

/** Onglets de la liste : correspondent au paramètre `statut` de GET /demandes/moi */
export type FiltreDemandes = "TOUTES" | "EN_COURS" | "TERMINEES" | "ANNULEES";

export interface ProfessionnelResume {
  id: string;
  nomComplet: string;
  titre: string | null;
  organisme: string | null;
  specialiteDominante: string | null;
  /** Peut être relative (/uploads/...) : passer par mediaUrl() */
  photoUrl: string | null;
  proximite: string | null;
}

export interface DemandeResume {
  id: string;
  reference: string;
  titre: string | null;
  statut: StatutDemande;
  niveauUrgence: NiveauUrgence | null;
  typeSaisie: TypeSaisie;
  dureeAudioSecondes: number | null;
  libelleLocalisation: string | null;
  dateCreation: string;
  dateCloture: string | null;
  /** Renseigné quand un professionnel a accepté */
  professionnel: ProfessionnelResume | null;
  avisDonne: boolean;
}

/** GET /demandes/moi/compteurs */
export interface CompteursDemandes {
  toutes: number;
  enCours: number;
  terminees: number;
  annulees: number;
}