import type { TypeDocumentPro } from "../../auth/types/types";

/** GET /pro/inscription/statut (spec 5.1) */
export type StatutDossierPro = "EN_ATTENTE" | "APPROUVE" | "REJETE";

export type CodeEtapeDossier =
  | "INFORMATIONS"
  | "DOCUMENTS"
  | "VERIFICATION"
  | "ACTIVATION";

export interface EtapeDossier {
  code: CodeEtapeDossier;
  libelle: string;
  etat: "FAIT" | "EN_COURS" | "A_VENIR";
}

export interface RejetDossier {
  motif: string;
  /** Pièce à remplacer, si le rejet en désigne une */
  pieceEnCause: TypeDocumentPro | null;
  commentaire: string | null;
}

export interface StatutDossier {
  reference: string;
  statut: StatutDossierPro;
  dateSoumission: string;
  dateTraitement: string | null;
  etapes: EtapeDossier[];
  /** null tant que le dossier n'est pas rejeté */
  rejet: RejetDossier | null;
  resoumissionPossible: boolean;
}

/** POST /pro/inscription/resoumettre (spec 5.2) */
export interface ResoumissionDossier {
  reference: string;
  statut: "EN_ATTENTE";
  dateSoumission: string;
  delaiMoyen: string;
}