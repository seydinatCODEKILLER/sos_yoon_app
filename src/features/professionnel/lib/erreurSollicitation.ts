import { toApiErreur } from "@/shared/lib/apiError";

const MESSAGES: Record<string, string> = {
  SOLLICITATION_EXPIREE: "Cette demande a expiré.",
  SOLLICITATION_CLOS: "Cette demande n'est plus en attente.",
  DEMANDE_DEJA_AFFECTEE:
    "Un autre professionnel a déjà accepté cette demande, ou le citoyen l'a annulée.",
  ABONNEMENT_EXPIRE: "Votre abonnement a expiré : renouvelez-le pour continuer.",
  RESEAU: "Connexion impossible. Vérifiez votre réseau.",
};

/** Message affichable pour une erreur de l'espace pro (accepter, refuser, disponibilité) */
export function messageEspacePro(error: unknown, parDefaut: string): string {
  const { code, message } = toApiErreur(error);
  return MESSAGES[code] ?? (message || parDefaut);
}