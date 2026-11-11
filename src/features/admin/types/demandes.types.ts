import type { MotifAdmin, TypeProfession } from "./professionnels.types";

export type { MotifAdmin };

export type StatutDemande =
  | "BROUILLON"
  | "ENVOYEE"
  | "ANALYSEE_IA"
  | "EN_ATTENTE_TRIAGE"
  | "EN_DISPATCH"
  | "RECHERCHE_PROFESSIONNEL"
  | "EN_ATTENTE_ACCEPTATION"
  | "ACCEPTEE"
  | "EN_COURS"
  | "TERMINEE"
  | "REFUSEE"
  | "ANNULEE"
  | "EXPIRE_FALLBACK";

export type NiveauUrgence = "NORMAL" | "URGENT" | "CRITIQUE";

/**
 * Valeurs acceptées par GET /admin/demandes?statut= : un regroupement qui correspond exactement
 * à une carte de synthèse (spec 13.25), ou un statut précis.
 */
export type FiltreStatutDemande =
  | "TOUS"
  | "A_QUALIFIER"
  | "EN_RECHERCHE"
  | "EN_COURS"
  | "TERMINEES"
  | "ANNULEES";

export type PrestationRecommandee = "CABINET" | "VISIO" | "APPEL" | "AUDIENCE";

export interface CompteursDemandes {
  total: number;
  enRecherche: number;
  enCours: number;
  terminees: number;
  aQualifier: number;
  /** Annulées ou expirées. Absent sur un backend qui n'a pas encore le correctif. */
  annulees?: number;
}

export interface CitoyenRef {
  id: string;
  nomComplet: string | null;
  telephone: string | null;
}

/** Ligne de la liste (spec <DemandeAdmin>). */
export interface DemandeAdmin {
  id: string;
  reference: string | null;
  date: string | null;
  citoyen: CitoyenRef | null;
  /** Valeurs de TypeProfession ; chaîne ouverte pour ne jamais casser sur une valeur inconnue. */
  metiers: (TypeProfession | string)[];
  matiere: string | null;
  statut: StatutDemande | string | null;
  niveauUrgence: NiveauUrgence | string | null;
  professionnel: string | null;
  tempsTraitementSecondes: number | null;
}

export interface AudioDemande {
  /** Lien signé relatif (/uploads/...?exp&sig) : passer par mediaUrl(). */
  url: string | null;
  dureeSecondes: number | null;
}

export interface LocalisationDemande {
  libelle: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface EntreeHistorique {
  ancienStatut: string | null;
  nouveauStatut: string | null;
  date: string | null;
  acteur: string | null;
}

export interface SollicitationDemande {
  rang: number | null;
  professionnel: string | null;
  statut: string | null;
  motifRefus: string | null;
  dateSollicitation: string | null;
  dateReponse: string | null;
}

export interface DemandeAdminDetail extends DemandeAdmin {
  description: string | null;
  audio: AudioDemande | null;
  transcription: string | null;
  localisation: LocalisationDemande | null;
  historique: EntreeHistorique[];
  sollicitations: SollicitationDemande[];
}

export interface ParamsDemandes {
  q: string;
  statut: FiltreStatutDemande;
  /** yyyy-MM-dd ou chaîne vide. */
  du: string;
  au: string;
  page: number; // 0-indexé, comme l'API
  taille: number;
}

export interface PageDemandes {
  contenu: DemandeAdmin[];
  page: number;
  taille: number;
  totalElements: number;
  totalPages: number;
}

export interface MatiereAdmin {
  id: string;
  libelle: string;
}

export interface QualificationPayload {
  matiereId: string;
  metiers: string[];
  niveauUrgence: NiveauUrgence;
  prestationRecommandee?: PrestationRecommandee;
}

export interface ReaffectationPayload {
  professionnelId: string;
  motif: string;
}

export interface AnnulationDemandePayload {
  motifId: string;
  observations?: string;
}