import { demandeErrorCode, demandeErrorMessage } from "./demandeErrors";

export const LIBELLES_NOTE = [
  "",
  "Très insatisfait",
  "Insatisfait",
  "Correct",
  "Satisfait",
  "Très satisfait",
] as const;

export const COMMENTAIRE_MAX = 500;

const MESSAGES: Record<string, string> = {
  AVIS_DEJA_DONNE: "Vous avez déjà donné votre avis sur cette demande.",
  DEMANDE_NON_TERMINEE: "Vous pourrez donner votre avis une fois la demande terminée.",
  NOTE_INVALIDE: "Choisissez une note entre 1 et 5 étoiles.",
};

export function messageAvis(error: unknown): string {
  return MESSAGES[demandeErrorCode(error)] ?? demandeErrorMessage(error);
}