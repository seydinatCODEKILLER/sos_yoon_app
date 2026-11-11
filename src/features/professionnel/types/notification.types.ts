/**
 * Notifications de la boîte in-app (spec §10) — communes au professionnel et au particulier.
 *
 * `type` reste une chaîne ouverte : le backend en émet plus que la spec
 * (SOLLICITATION_RECUE, DOSSIER_APPROUVE, COMPTE_SUSPENDU, SYSTEME…) et en ajoutera d'autres.
 * L'écran ne doit jamais casser sur un type inconnu.
 */
export type FiltreNotifications = "TOUTES" | "NON_LUES";

export type CibleNotification =
  | "SOLLICITATION"
  | "ABONNEMENT"
  | "DEMANDE"
  | "CONVERSATION"
  | "TELECHARGER_COMPTE_RENDU";

export interface ActionNotification {
  libelle: string;
  /** Chaîne ouverte pour ne pas casser sur une cible future. */
  cible: CibleNotification | (string & {});
}

export interface PieceJointeNotification {
  id: string;
  nom: string;
  tailleOctets: number | null;
}

export interface Notification {
  id: string;
  type: string;
  titre: string;
  message: string;
  lue: boolean;
  /**
   * Date sans fuseau côté serveur : toujours passer par parseDateServeur.
   * Peut être null (anciennes lignes créées sans date) : l'écran doit le tolérer.
   */
  dateCreation: string | null;
  demandeId: string | null;
  referenceDemande: string | null;
  conversationId: string | null;
  pieceJointe: PieceJointeNotification | null;
  action: ActionNotification | null;
}

export interface CompteursNotifications {
  toutes: number;
  nonLues: number;
  /** Présents côté backend, absents de la spec : jamais requis. */
  demandes?: number;
  messages?: number;
  systeme?: number;
}

export interface MarquerToutLuReponse {
  marquees: number;
}