import { toApiErreur } from "@/shared/lib/apiError";

/**
 * Erreurs de POST /particulier/code-secret :
 *  400 CODE_SECRET_INCORRECT   (le serveur ne donne pas le nombre d'essais restants ici)
 *  423 CODE_SECRET_BLOQUE
 *  422 CODE_SECRET_TROP_SIMPLE
 */
export function codeSecretErrorMessage(e: unknown) {
  const erreur = toApiErreur(e);

  switch (erreur.code) {
    case "CODE_SECRET_INCORRECT":
      return "Code actuel incorrect.";
    case "CODE_SECRET_BLOQUE":
      return "Trop de tentatives. Réessayez plus tard.";
    case "CODE_SECRET_TROP_SIMPLE":
      return "Choisissez un code moins évident (pas 0000, 1234…).";
    default:
      return erreur.message || "Une erreur est survenue. Réessayez.";
  }
}