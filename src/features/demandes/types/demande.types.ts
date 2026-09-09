import type { Metier } from "@/types/user.types";

export type DemandeStatut =
  | "ENVOYEE"
  | "ANALYSE_EN_COURS"
  | "RECHERCHE_PROFESSIONNEL"
  | "EN_ATTENTE_ACCEPTATION";
// ⚠️ Liste incomplète : seuls les statuts visibles dans
// simulateAnalyseEtMatching sont connus à ce jour. Les statuts
// post-matching (acceptation/refus par le pro, terminée, annulée...)
// ne sont pas encore définis côté backend — à compléter dès qu'ils existent.

export type Urgence = "FAIBLE" | "MOYENNE" | "ELEVEE";

export interface ProfessionnelSummary {
  id: string;
  metier: Metier;
  specialite: string | null;
  cabinet?: string | null;
  user: {
    nom: string;
    prenom: string;
    telephone?: string | null;
  };
}

export interface Demande {
  id: string;
  userId: string;
  descriptionTexte: string | null;
  audioUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  statut: DemandeStatut;
  metierIdentifie: Metier | null;
  urgence: Urgence | null;
  professionnelId: string | null;
  professionnel?: ProfessionnelSummary | null;
  createdAt: string;
}

export interface CreateDemandePayload {
  descriptionTexte?: string;
  audioUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface ListDemandesFilters {
  page?: number;
  limit?: number;
}
