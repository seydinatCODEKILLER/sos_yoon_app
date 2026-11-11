export type TypeProfession = "AVOCAT" | "HUISSIER" | "NOTAIRE" | "JURISTE_CONSEIL";

/** Spec 13.5 : les trois dossiers d'inscription les plus anciens. */
export interface InscriptionEnAttente {
  dossierId: string;
  professionnelId: string | null;
  nomComplet: string | null;
  typeProfession: TypeProfession | null;
  ville?: string | null;
  /** ISO 8601 */
  dateSoumission: string | null;
}

export interface RepartitionMetier {
  typeProfession: TypeProfession;
  nombre: number;
}

export interface TableauDeBordAdmin {
  utilisateurs: { total: number; nouveauxCetteSemaine: number };
  professionnels: { total: number; actifs: number; enAttente: number };
  demandes: {
    total: number;
    nouvellesCetteSemaine: number;
    enCours: number;
    aQualifier: number;
  };
  inscriptionsEnAttente: InscriptionEnAttente[];
  /** Professionnels actifs par métier. */
  repartitionMetiers: RepartitionMetier[];
}

export type VueEvolution = "JOUR" | "SEMAINE" | "MOIS" | "METIER";

/** Spec 13.42. `libelles`, `cetteAnnee` et `anneePassee` ont la même longueur. */
export interface EvolutionDemandes {
  vue: VueEvolution;
  libelles: string[];
  cetteAnnee: number[];
  anneePassee: number[];
}