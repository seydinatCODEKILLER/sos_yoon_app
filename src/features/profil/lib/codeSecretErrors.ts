import { toApiErreur } from "@/shared/lib/apiError";

export function codeSecretErrorMessage(e: unknown) {
  const erreur = toApiErreur(e);

  switch (erreur.code) {
    case "CODE_SECRET_INCORRECT": {
      const details = erreur.details as { essaisRestants?: number } | undefined;
      const restants = details?.essaisRestants;
      if (restants === undefined) return "Code actuel incorrect.";
      return restants > 1
        ? `Code actuel incorrect. ${restants} essais restants.`
        : `Code actuel incorrect. Dernier essai.`;
    }
    case "COMPTE_VERROUILLE":
      return "Trop de tentatives. Votre compte est verrouillé temporairement.";
    default:
      return erreur.message || "Une erreur est survenue. Réessayez.";
  }
}