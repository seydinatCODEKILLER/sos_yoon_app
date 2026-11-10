import { toApiErreur } from "@/shared/lib/apiError";
import { messageEspacePro } from "./erreurSollicitation";

/** Champs de l'API → champs du formulaire */
export const CHAMP_FORMULAIRE: Record<string, string> = {
  titre: "titre",
  type: "type",
  debut: "heureDebut",
  fin: "heureFin",
  lieu: "lieu",
  dossierDemandeId: "dossierDemandeId",
};

export function codeAgenda(error: unknown) {
  return toApiErreur(error).code;
}

/** Message affichable pour une erreur d'écriture dans l'agenda */
export function messageAgenda(error: unknown, parDefaut: string, modification = false) {
  switch (codeAgenda(error)) {
    case "PERIODE_INVALIDE":
      return "L'heure de fin doit suivre l'heure de début.";
    case "INTROUVABLE":
      return modification
        ? "Ce rendez-vous n'existe plus. Fermez cette fenêtre : l'agenda va se mettre à jour."
        : "Ce dossier est introuvable parmi vos dossiers.";
    default:
      return messageEspacePro(error, parDefaut);
  }
}