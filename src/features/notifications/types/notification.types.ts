export type TypeNotification =
  | "DEMANDE_ACCEPTEE"
  | "DEMANDE_SANS_REPONSE"
  | "DEMANDE_TERMINEE";

export interface Notification {
  id: string;
  type: TypeNotification;
  titre: string;
  message: string;
  /** ISO */
  date: string;
  lue: boolean;
  /** Demande concernée : la notification y mène au clic */
  demandeId: string | null;
}