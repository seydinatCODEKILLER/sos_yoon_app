/** Défini ici (et réutilisé par les types Professionnels et Demandes) : ne pas le déplacer. */
export interface MotifAdmin {
  id: string;
  libelle: string;
}

/**
 * Statuts renvoyés par l'API pour un citoyen. Chaîne ouverte : le serveur peut renvoyer d'autres
 * valeurs (ex. EN_ATTENTE_VALIDATION) et l'écran ne doit jamais casser dessus.
 */
export type StatutCompteUtilisateur = "ACTIF" | "SUSPENDU_ADMIN" | "CLOTURE" | (string & Record<never, never>);

export type FiltreStatutUtilisateur = "TOUS" | "ACTIF" | "DESACTIVE";

/** Valeurs acceptées par GET /admin/motifs?type= pour les citoyens (spec 13.31). */
export type TypeMotifUtilisateur = "DESACTIVATION_USER" | "REACTIVATION_USER";

/** Valeurs acceptées par GET /admin/utilisateurs/{id}/demandes?statut= (spec 13.8). */
export type FiltreDemandesUtilisateur = "TOUTES" | "EN_COURS" | "TERMINEES" | "ANNULEES_EXPIREES";

/** Ligne de la liste (spec <UtilisateurAdmin>). */
export interface UtilisateurAdmin {
  id: string;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  email: string | null;
  nombreDemandes: number;
  dateInscription: string | null; // ISO UTC
  statutCompte: StatutCompteUtilisateur;
}

/** Réponse paginée de l'API admin : `page` est 0-indexé. */
export interface PageAdmin<T> {
  contenu: T[];
  page: number;
  taille: number;
  totalElements: number;
  totalPages: number;
}

export type PageUtilisateurs = PageAdmin<UtilisateurAdmin>;

export interface ParamsUtilisateurs {
  q: string;
  statut: FiltreStatutUtilisateur;
  page: number; // 0-indexé, comme l'API
  taille: number;
}

export interface CompteursUtilisateurs {
  total: number;
  actifs: number;
  desactives: number;
  demandesInitiees: number;
}

export interface DesactivationInfo {
  date: string | null;
  motif: string | null;
  observations: string | null;
}

/** Fiche d'un citoyen (spec <UtilisateurAdminDetail>). */
export interface UtilisateurAdminDetail {
  id: string;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  telephoneVerifie: boolean;
  email: string | null;
  dateInscription: string | null;
  derniereConnexion: string | null;
  statutCompte: StatutCompteUtilisateur;
  nombreDemandes: number;
  desactivation: DesactivationInfo | null;
}

/** Ligne de l'historique des demandes d'un citoyen (spec <DemandeAdminResume>). */
export interface DemandeUtilisateur {
  id: string;
  reference: string | null;
  titre: string | null;
  statut: string | null;
  extrait: string | null;
  dateCreation: string | null;
  priseEnChargeMinutes: number | null;
  professionnel: string | null;
  motifAnnulation: string | null;
  annuleePar: string | null;
  attenteAvantAnnulationMinutes: number | null;
}

export type PageDemandesUtilisateur = PageAdmin<DemandeUtilisateur>;

/** Ce dont le dialogue de changement de statut a besoin : la liste et la fiche lui passent la même chose. */
export interface CibleUtilisateur {
  id: string;
  nomComplet: string;
  telephone: string | null;
  /** true : le compte est désactivé, on propose de le réactiver. */
  desactive: boolean;
}

export interface ChangementStatutPayload {
  motifId: string;
  observations: string;
}