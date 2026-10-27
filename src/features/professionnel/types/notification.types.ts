export type FiltreNotifications = "TOUTES" | "NON_LUES";

/** Deux sources au MVP : nouvelles demandes et abonnement */
export type CibleNotification = "SOLLICITATION" | "ABONNEMENT";

export interface Notification {
  id: string;
  /** SOLLICITATION_NOUVELLE, ABONNEMENT_ESSAI_BIENTOT_FIN, ABONNEMENT_EXPIRE… */
  type: string;
  titre: string;
  message: string;
  lue: boolean;
  /** ISO 8601 */
  dateCreation: string;
  referenceDemande: string | null;
  /** Ville / quartier de la demande (nouvelle demande seulement) */
  lieu: string | null;
  /** Délai de réponse restant, en minutes (nouvelle demande seulement) */
  delaiReponseMinutes: number | null;
  action: { libelle: string; cible: CibleNotification } | null;
}

export interface PageNotifications {
  contenu: Notification[];
  page: number;
  taille: number;
  totalElements: number;
  totalPages: number;
}

export interface CompteursNotifications {
  toutes: number;
  nonLues: number;
}