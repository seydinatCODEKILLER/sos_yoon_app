import axios from "axios";
import type { ApiErreur } from "@/types/api.types";

const isApiErreurLike = (e: unknown): e is { code: string; message: string } =>
  typeof e === "object" &&
  e !== null &&
  typeof (e as Record<string, unknown>).code === "string" &&
  typeof (e as Record<string, unknown>).message === "string";

export function toApiErreur(error: unknown): ApiErreur {
  const horodatage = new Date().toISOString();

  if (axios.isAxiosError(error)) {
    // Pas de réponse : réseau coupé, timeout, serveur injoignable
    if (!error.response) {
      return {
        code: "RESEAU",
        message: "Connexion impossible. Vérifiez votre réseau.",
        horodatage,
      };
    }

    const { status, data } = error.response;
    return {
      code: data?.code ?? `HTTP_${status}`,
      message: data?.message ?? error.message,
      details: Array.isArray(data?.details) ? data.details : undefined,
      horodatage: data?.horodatage ?? horodatage,
    };
  }

  // Erreurs déjà au bon format (celles que lance le mock)
  if (isApiErreurLike(error)) {
    return { horodatage, ...error } as ApiErreur;
  }

  return {
    code: "INCONNU",
    message: error instanceof Error ? error.message : "Une erreur est survenue.",
    horodatage,
  };
}

/** Lit la valeur d'un champ dans `details` (ex. "tentativesRestantes"). */
export function detailValue(e: ApiErreur, champ: string): string | undefined {
  return e.details?.find((d) => d.champ === champ)?.message;
}