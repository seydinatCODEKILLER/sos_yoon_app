export type TypeSaisie = "TEXTE" | "VOCAL";

export interface MotCleFrequent {
  motCle: string;
  libelle: string;
}

export interface CreerDemandePayload {
  typeSaisie: TypeSaisie;
  /** Obligatoire pour TEXTE, 1 000 caractères max. Omise pour VOCAL. */
  description?: string;
  motsCles: string[];
}

export interface ModifierDemandePayload {
  description?: string;
  motsCles?: string[];
}

export interface EnvoyerAudioPayload {
  fichier: Blob;
  dureeSecondes: number;
}

export interface DemandeAudio {
  url: string;
  dureeSecondes: number;
}

export interface DemandeLocalisation {
  libelle: string;
  rayonKm: number;
  latitudeApprox: number | null;
  longitudeApprox: number | null;
}

/** <DemandeDetail> du document (section 2) */
export interface DemandeDetail {
  id: string;
  reference: string;
  titre: string | null;
  typeSaisie: TypeSaisie;
  description: string | null;
  motsCles: string[];
  audio: DemandeAudio | null;
  transcription: string | null;
  /** BROUILLON, EN_ATTENTE_ACCEPTATION, EN_COURS… (liste complète non fixée par le document) */
  statut: string;
  niveauUrgence: string | null;
  matiere: { id: string; libelle: string } | null;
  metiersRequis: string[];
  localisation: DemandeLocalisation | null;
  dateCreation: string;
  dateEnvoi: string | null;
  professionnel: Record<string, unknown> | null;
  conversationId: string | null;
  compteRenduDisponible: boolean;
  avisDonne: boolean;
}