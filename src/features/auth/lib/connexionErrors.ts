import { toApiErreur } from "@/shared/lib/apiError";
import { authErrorMessage } from "./authErrors";

export function connexionParticulierMessage(error: unknown): string {
  const e = toApiErreur(error);

  if (e.code === "CODE_SECRET_INCORRECT") {
    const n = Number((e.details as Record<string, unknown> | undefined)?.essaisRestants);
    if (Number.isFinite(n) && n > 0) {
      return `Code incorrect. Il vous reste ${n} essai${n > 1 ? "s" : ""}.`;
    }
    return "Code incorrect.";
  }
  if (e.code === "COMPTE_VERROUILLE") {
    return "Trop de tentatives. Réessayez dans quelques minutes.";
  }
  return authErrorMessage(error);
}