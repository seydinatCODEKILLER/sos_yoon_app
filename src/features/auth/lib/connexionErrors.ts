import { detailValue, toApiErreur } from "@/shared/lib/apiError";
import { authErrorMessage } from "./authErrors";

/** Messages de la connexion particulier (numéro + code secret). */
export function connexionParticulierMessage(error: unknown): string {
  const e = toApiErreur(error);

  // 401 : numéro inconnu OU code faux (le serveur ne les distingue pas).
  // `tentativesRestantes` n'est présent que si le numéro existe et le code est faux.
  if (e.code === "IDENTIFIANTS_INVALIDES") {
    const n = Number(detailValue(e, "tentativesRestantes"));
    if (Number.isFinite(n) && n > 0) {
      return `Numéro ou code incorrect. Il vous reste ${n} essai${n > 1 ? "s" : ""}.`;
    }
    return "Numéro ou code incorrect.";
  }

  // 423 : trop d'essais ratés, le code secret est bloqué un moment.
  if (e.code === "CODE_SECRET_BLOQUE") {
    const secondes = Number(detailValue(e, "retryAfterSeconds"));
    if (Number.isFinite(secondes) && secondes > 0) {
      const minutes = Math.ceil(secondes / 60);
      return `Trop de tentatives. Réessayez dans ${minutes} minute${minutes > 1 ? "s" : ""} ou utilisez « Code oublié ? ».`;
    }
    return "Trop de tentatives. Réessayez plus tard ou utilisez « Code oublié ? ».";
  }

  // 409 : compte créé par le parcours « demande d'abord », sans code secret.
  if (e.code === "CODE_SECRET_NON_DEFINI") {
    return "Vous n'avez pas encore de code secret. Utilisez « Code oublié ? » pour en choisir un.";
  }

  return authErrorMessage(error);
}