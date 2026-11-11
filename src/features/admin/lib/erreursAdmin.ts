import { toApiErreur } from "@/shared/lib/apiError";

const MESSAGES: Record<string, string> = {
  DOSSIER_DEJA_TRAITE: "Ce dossier a déjà été traité par un autre administrateur. La liste a été actualisée.",
  EMAIL_NON_VERIFIE: "L'adresse e-mail du professionnel n'est pas encore confirmée.",
  PROFESSIONNEL_DEJA_SUSPENDU: "Ce professionnel est déjà désactivé.",
  INTROUVABLE: "Élément introuvable. Il a peut-être été supprimé.",
  ACCES_REFUSE: "Vous n'avez pas le droit d'effectuer cette action.",
  TROP_DE_REQUETES: "Trop de tentatives. Réessayez dans un instant.",
};

/**
 * Message affichable pour une erreur de l'API admin : le code connu d'abord, sinon le message
 * du serveur (déjà rédigé en français), sinon le texte par défaut.
 */
export function messageAdmin(error: unknown, parDefaut = "Une erreur est survenue. Réessayez."): string {
  const e = toApiErreur(error);
  return MESSAGES[e.code] ?? (e.message && e.code !== "ERREUR_INTERNE" ? e.message : parDefaut);
}