import { toApiErreur } from "@/shared/lib/apiError";

const MESSAGES: Record<string, string> = {
  INTROUVABLE: "Cette demande est introuvable.",
  FICHIER_TROP_VOLUMINEUX: "Le fichier est trop volumineux (5 Mo maximum).",
  FORMAT_NON_SUPPORTE: "Ce format de fichier n'est pas pris en charge.",
  DEMANDE_NON_ANNULABLE: "Cette demande ne peut plus être annulée.",
  DEMANDE_NON_REORIENTABLE:
    "Cette demande ne peut plus être réorientée : elle est déjà prise en charge.",
  AUCUN_PROFESSIONNEL_SUIVANT:
    "Aucun autre professionnel n'est disponible. Votre demande est transmise à l'équipe SOS Yoon.",
  TROP_DE_REQUETES: "Trop de tentatives. Réessayez dans un instant.",
  RESEAU: "Connexion impossible. Vérifiez votre réseau.",
};

export const demandeErrorCode = (error: unknown) => toApiErreur(error).code;

/** Message d'un champ précis d'un 400 VALIDATION_ERREUR (ex. « description ») */
export function demandeDetailChamp(
  error: unknown,
  champ: string,
): string | undefined {
  return toApiErreur(error).details?.find((d) => d.champ === champ)?.message;
}

export function demandeErrorMessage(error: unknown): string {
  const e = toApiErreur(error);
  if (e.code === "VALIDATION_ERREUR") {
    // Le serveur indique le champ en erreur : on affiche son message précis
    return (
      e.details?.[0]?.message ??
      "Certaines informations sont invalides. Vérifiez votre message."
    );
  }
  return MESSAGES[e.code] ?? e.message;
}