/**
 * Notifications du particulier (spec §10).
 * `type` reste une chaîne ouverte : le backend émet DEMANDE_ENVOYEE, DEMANDE_ACCEPTEE,
 * NOUVEAU_MESSAGE, DEMANDE_TERMINEE, SYSTEME, COMPTE_SUSPENDU… et en ajoutera d'autres.
 * L'écran ne doit jamais casser sur un type inconnu.
 */
export type FiltreNotifications = "TOUTES" | "NON_LUES";

export type CibleNotification =
  | "DEMANDE"
  | "CONVERSATION"
  | "TELECHARGER_COMPTE_RENDU";

export interface ActionNotification {
  libelle: string;
  /** Chaîne ouverte pour ne pas casser sur une cible future. */
  cible: CibleNotification | (string & {});
}

export interface Notification {
  id: string;
  type: string;
  titre: string;
  message: string;
  lue: boolean;
  /**
   * Date sans fuseau côté serveur : toujours passer par parseDateServeur.
   * Peut être null (anciennes lignes créées sans date).
   */
  dateCreation: string | null;
  /** Demande concernée : la notification y mène au clic. */
  demandeId: string | null;
  referenceDemande: string | null;
  conversationId: string | null;
  action: ActionNotification | null;
}

export interface CompteursNotifications {
  toutes: number;
  nonLues: number;
}