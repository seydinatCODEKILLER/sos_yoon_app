export type StatutCompteUtilisateur = "ACTIF" | "SUSPENDU_ADMIN" | "CLOTURE";
export type FiltreStatutUtilisateur = "TOUS" | "ACTIF" | "DESACTIVE";
export type TypeMotif = "DESACTIVATION" | "REACTIVATION";

export interface UtilisateurAdmin {
  id: string;
  prenom: string;
  nom: string;
  telephone: string;
  email: string | null;
  nombreDemandes: number;
  dateInscription: string; // ISO
  statutCompte: StatutCompteUtilisateur;
}

export interface ParamsUtilisateurs {
  q: string;
  statut: FiltreStatutUtilisateur;
  page: number; // 1-indexé
  taille: number;
}

export interface PageUtilisateurs {
  elements: UtilisateurAdmin[];
  total: number;
  page: number;
  taille: number;
}

export interface CompteursUtilisateurs {
  total: number;
  actifs: number;
  desactives: number;
  demandesInitiees: number;
}

export interface MotifAdmin {
  id: string;
  libelle: string;
}

export interface ChangementStatutPayload {
  motifId: string;
  observations: string;
}