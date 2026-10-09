import { toApiErreur } from "@/shared/lib/apiError";

const MESSAGES: Record<string, string> = {
  VALIDATION_ERREUR: "Certaines informations sont invalides. Vérifiez votre message.",
  INTROUVABLE: "Cette demande est introuvable.",
  DEMANDE_NON_MODIFIABLE: "Cette demande a déjà été envoyée et ne peut plus être modifiée.",
  TROP_DE_REQUETES: "Trop de tentatives. Réessayez dans un instant.",
  RESEAU: "Connexion impossible. Vérifiez votre réseau.",
};

export const demandeErrorCode = (error: unknown) => toApiErreur(error).code;

export function demandeErrorMessage(error: unknown): string {
  const e = toApiErreur(error);
  return MESSAGES[e.code] ?? e.message;
}