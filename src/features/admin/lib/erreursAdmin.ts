import { toApiErreur } from "@/shared/lib/apiError";

const MESSAGES: Record<string, string> = {
  DOSSIER_DEJA_TRAITE: "Ce dossier a déjà été traité par un autre administrateur. La liste a été actualisée.",
  EMAIL_NON_VERIFIE: "L'adresse e-mail du professionnel n'est pas encore confirmée.",
  PROFESSIONNEL_DEJA_SUSPENDU: "Ce professionnel est déjà désactivé.",
  COMPTE_DEJA_SUSPENDU: "Ce compte est déjà désactivé. La liste a été actualisée.",
  COMPTE_NON_SUSPENDU: "Ce compte n'est pas désactivé : il n'y a rien à réactiver.",
  PAIEMENT_DEJA_ENREGISTRE: "Un paiement avec cette référence est déjà enregistré. Les données ont été actualisées.",
  INTROUVABLE: "Élément introuvable. Il a peut-être été supprimé.",
  ACCES_REFUSE: "Vous n'avez pas le droit d'effectuer cette action.",
  TROP_DE_REQUETES: "Trop de tentatives. Réessayez dans un instant.",
  DEMANDE_NON_MODIFIABLE: "Cette demande est terminée ou annulée : elle ne peut plus être modifiée.",
  DEMANDE_DEJA_ATTRIBUEE: "Cette demande est déjà attribuée à un professionnel.",
  DEMANDE_DEJA_ANNULEE: "Cette demande est déjà annulée.",
  DEMANDE_NON_ANNUABLE: "Une demande terminée ne peut pas être annulée.",
  PROFESSIONNEL_INDISPONIBLE: "Ce professionnel ne peut pas recevoir de demande : son compte n'est pas actif.",
};

/**
 * Message affichable pour une erreur de l'API admin : le code connu d'abord, sinon le message
 * du serveur (déjà rédigé en français), sinon le texte par défaut.
 */
export function messageAdmin(error: unknown, parDefaut = "Une erreur est survenue. Réessayez."): string {
  const e = toApiErreur(error);
  return MESSAGES[e.code] ?? (e.message && e.code !== "ERREUR_INTERNE" ? e.message : parDefaut);
}