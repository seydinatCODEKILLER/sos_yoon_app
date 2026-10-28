export type TypeProfession = "AVOCAT" | "HUISSIER" | "NOTAIRE" | "JURISTE_CONSEIL";

export interface InscriptionEnAttente {
  dossierId: string;
  professionnelId: string;
  nomComplet: string;
  typeProfession: TypeProfession;
  /** ISO 8601 */
  dateSoumission: string;
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
  /** Les 3 dossiers les plus anciens */
  inscriptionsEnAttente: InscriptionEnAttente[];
  /** Ajout proposé à 13.5 : professionnels actifs par métier */
  repartitionMetiers: RepartitionMetier[];
}

export type VueEvolution = "JOUR" | "SEMAINE" | "MOIS" | "METIER";

export interface EvolutionDemandes {
  vue: VueEvolution;
  libelles: string[];
  cetteAnnee: number[];
  anneePassee: number[];
}