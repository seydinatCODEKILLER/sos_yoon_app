import { toApiErreur } from "@/shared/lib/apiError";

const MESSAGES: Record<string, string> = {
  COMPTE_EXISTANT: "Un compte existe déjà avec ce numéro. Connectez-vous.",
  COMPTE_INEXISTANT: "Aucun compte avec ce numéro. Inscrivez-vous.",
  COMPTE_SUSPENDU: "Ce compte est suspendu. Contactez le support.",
  CGU_NON_ACCEPTEES: "Vous devez accepter les conditions d'utilisation.",
  TROP_DE_REQUETES: "Trop de tentatives. Patientez un instant.",
  RENVOI_TROP_TOT: "Patientez un instant avant de demander un nouveau code.",
  OTP_INVALIDE: "Code invalide, réessayez.",
  OTP_EXPIRE: "Ce code a expiré. Demandez-en un nouveau.",
  OTP_BLOQUE: "Trop de tentatives. Demandez un nouveau code.",
  JETON_INVALIDE: "Votre session a expiré. Recommencez.",
  JETON_EXPIRE: "Votre session a expiré. Recommencez.",
  CODE_SECRET_TROP_SIMPLE: "Choisissez un code moins évident (pas 0000, 1234…).",
  RESEAU: "Connexion impossible. Vérifiez votre réseau.",
};

export function authErrorMessage(error: unknown): string {
  const err = toApiErreur(error);
  return MESSAGES[err.code] ?? err.message;
}