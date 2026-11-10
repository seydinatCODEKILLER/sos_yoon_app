import { toApiErreur } from "@/shared/lib/apiError";
import type { RegisterProfessionnelValues } from "../schema/registerProfessionnel.schema";
import { authErrorMessage } from "./authErrors";

export type ChampInscriptionPro = keyof RegisterProfessionnelValues;

interface Cible {
  champ?: ChampInscriptionPro;
  /** Étapes du formulaire : 0 compte, 1 profil, 2 documents, 3 localisation */
  etape: number;
}

/** Champs désignés par le serveur (details[].champ) */
const CHAMPS: Record<string, Cible & { champ: ChampInscriptionPro }> = {
  prenom: { champ: "prenom", etape: 0 },
  nom: { champ: "nom", etape: 0 },
  telephone: { champ: "telephone", etape: 0 },
  email: { champ: "email", etape: 0 },
  motDePasse: { champ: "password", etape: 0 },
  confirmationMotDePasse: { champ: "confirmPassword", etape: 0 },
  typeProfession: { champ: "metier", etape: 1 },
  matricule: { champ: "numeroOrdre", etape: 1 },
  specialiteIds: { champ: "specialites", etape: 1 },
  declarationHonneur: { champ: "declarationHonneur", etape: 2 },
  "documents.CARTE_PRO": { champ: "carteProfessionnelle", etape: 2 },
  "documents.DIPLOME": { champ: "diplome", etape: 2 },
  "documents.PIECE_IDENTITE": { champ: "pieceIdentite", etape: 2 },
  regionId: { champ: "regionId", etape: 3 },
  adresseCabinet: { champ: "adresse", etape: 3 },
};

/** Erreurs dont le code suffit à savoir où ramener le professionnel (message : authErrors.ts) */
const PAR_CODE: Record<string, Cible> = {
  EMAIL_DEJA_UTILISE: { champ: "email", etape: 0 },
  MATRICULE_DEJA_UTILISE: { champ: "numeroOrdre", etape: 1 },
  MOT_DE_PASSE_FAIBLE: { champ: "password", etape: 0 },
  FICHIER_TROP_VOLUMINEUX: { etape: 2 },
  FORMAT_NON_SUPPORTE: { etape: 2 },
  TYPE_DOCUMENT_NON_AUTORISE: { etape: 2 },
};

export interface ErreurInscriptionPro {
  message: string;
  /** Champ du formulaire à marquer en erreur */
  champ?: ChampInscriptionPro;
  /** Étape à rouvrir */
  etape?: number;
}

/** « donnees.motDePasse » → « motDePasse » ; « documents.CARTE_PRO » reste tel quel */
function cleChamp(brut: string): string {
  if (brut.startsWith("documents.")) return brut;
  return brut.split(".").pop() ?? brut;
}

export function erreurInscriptionPro(error: unknown): ErreurInscriptionPro {
  const e = toApiErreur(error);

  const parCode = PAR_CODE[e.code];
  if (parCode) return { message: authErrorMessage(error), ...parCode };

  if (e.code === "DOSSIER_INCOMPLET" || e.code === "VALIDATION_ERREUR") {
    // Le serveur désigne le champ fautif : on s'y rend
    for (const d of e.details ?? []) {
      const cible = CHAMPS[cleChamp(d.champ)];
      if (!cible) continue;
      const message =
        cible.champ === "declarationHonneur"
          ? "Vous devez cocher la déclaration sur l'honneur."
          : e.code === "DOSSIER_INCOMPLET"
            ? "Ce document est requis."
            : d.message;
      return { message, ...cible };
    }
    return {
      message:
        e.code === "DOSSIER_INCOMPLET"
          ? authErrorMessage(error)
          : "Certaines informations sont invalides. Vérifiez le formulaire.",
    };
  }

  return { message: authErrorMessage(error) };
}