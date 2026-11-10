import { toApiErreur } from "@/shared/lib/apiError";

const MESSAGES: Record<string, string> = {
  COMPTE_EXISTANT: "Un compte existe déjà avec ce numéro. Connectez-vous.",
  COMPTE_INEXISTANT: "Aucun compte avec ce numéro. Inscrivez-vous.",
  COMPTE_SUSPENDU: "Ce compte est suspendu. Contactez le support.",
  CGU_NON_ACCEPTEES: "Vous devez accepter les conditions d'utilisation.",
  RENVOI_TROP_TOT: "Patientez un instant avant de demander un nouveau code.",
  OTP_INVALIDE: "Code invalide, réessayez.",
  OTP_EXPIRE: "Ce code a expiré. Demandez-en un nouveau.",
  OTP_BLOQUE: "Trop de tentatives. Demandez un nouveau code.",
  JETON_INVALIDE: "Votre session a expiré. Recommencez.",
  JETON_EXPIRE: "Votre session a expiré. Recommencez.",
  CODE_SECRET_TROP_SIMPLE: "Choisissez un code moins évident (pas 0000, 1234…).",
  RESEAU: "Connexion impossible. Vérifiez votre réseau.",

  // ── Professionnel (e-mail + mot de passe) ──
  IDENTIFIANTS_INVALIDES: "E-mail ou mot de passe incorrect.",
  EMAIL_DEJA_UTILISE:
    "Un compte existe déjà avec cette adresse e-mail. Connectez-vous, ou utilisez « Mot de passe oublié ».",
  MATRICULE_DEJA_UTILISE: "Ce numéro professionnel est déjà enregistré.",
  MOT_DE_PASSE_FAIBLE:
    "Mot de passe trop faible : 8 caractères minimum, avec 1 chiffre et 1 symbole.",
  ANCIEN_MOT_DE_PASSE_INCORRECT: "L'ancien mot de passe est incorrect.",
  FICHIER_TROP_VOLUMINEUX: "Un de vos fichiers dépasse 5 Mo. Réduisez-le puis renvoyez.",
  FORMAT_NON_SUPPORTE:
    "Un de vos fichiers n'est pas accepté. Formats : PDF, JPG ou PNG.",
  TYPE_DOCUMENT_NON_AUTORISE:
    "Un document envoyé ne correspond pas à votre type de profession.",
  DOSSIER_INCOMPLET: "Votre dossier est incomplet. Vérifiez vos documents.",
  RESOUMISSION_IMPOSSIBLE: "Ce dossier ne peut pas être renvoyé pour le moment.",
};

export function authErrorMessage(error: unknown): string {
  const err = toApiErreur(error);
  return MESSAGES[err.code] ?? err.message;
}