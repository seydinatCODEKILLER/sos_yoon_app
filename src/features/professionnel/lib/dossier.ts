import { toApiErreur } from "@/shared/lib/apiError";
import { messageEspacePro } from "./erreurSollicitation";

/** Un compte rendu de clôture : PDF, 10 Mo au plus (limite du backend) */
export const TAILLE_MAX_COMPTE_RENDU = 10 * 1024 * 1024;

const MESSAGES: Record<string, string> = {
  DOSSIER_DEJA_CLOTURE: "Ce dossier est déjà clôturé.",
  ACCES_REFUSE: "Ce dossier ne vous appartient pas.",
  INTROUVABLE: "Ce dossier est introuvable.",
  STATUT_INVALIDE: "Ce changement de statut n'est pas possible.",
  FORMAT_NON_SUPPORTE: "Format non pris en charge : joignez un fichier PDF.",
};

/** Message affichable pour une erreur de la section dossiers */
export function messageDossier(error: unknown, parDefaut: string): string {
  return MESSAGES[toApiErreur(error).code] ?? messageEspacePro(error, parDefaut);
}

export function codeErreur(error: unknown): string {
  return toApiErreur(error).code;
}

/** 430080 → « 420 Ko » */
export function formaterTaille(octets: number): string {
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`;
  return `${(octets / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}