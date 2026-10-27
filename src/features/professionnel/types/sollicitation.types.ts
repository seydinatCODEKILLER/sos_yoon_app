import type { MotifRefus } from "../lib/motifsRefus";
import type { SollicitationResume } from "./dashboard.types";

export type OngletSollicitations = "NOUVELLES" | "REFUSEES" | "HISTORIQUE";

export interface PageSollicitations {
  contenu: SollicitationResume[];
  page: number;
  taille: number;
  totalElements: number;
  totalPages: number;
}

export interface RefusPayload {
  motif: MotifRefus;
  /** Obligatoire pour AUTRE, facultatif sinon */
  commentaire?: string;
}

export interface RefusResultat {
  sollicitationId: string;
  statut: "REFUSEE";
  /** false : plus aucun professionnel disponible, la demande passe à l'équipe SOS Yoon */
  demandeReaffectee: boolean;
}

export interface SollicitationDetail extends Omit<SollicitationResume, "citoyen"> {
  description: string | null;
  motsCles: string[];
  /** Disponible à partir de la phase P2 */
  audio: { url: string; dureeSecondes: number } | null;
  /** Disponible à partir de la phase P2 */
  transcription: string | null;
  metiersRequis: string[];
  prestationRecommandee: string | null;
  /** Téléphone et email valent null tant que la demande n'est pas acceptée */
  citoyen: { affichage: string; telephone: string | null; email: string | null };
}