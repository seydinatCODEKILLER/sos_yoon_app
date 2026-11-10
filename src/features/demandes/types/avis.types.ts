/** POST /demandes/{id}/avis (spec 8.9) */
export interface AvisPayload {
  /** De 1 à 5 */
  note: number;
  commentaire?: string;
}

export interface AvisEnregistre {
  id: string;
  note: number;
  commentaire: string | null;
  /** Date et heure sans fuseau (UTC) */
  date: string;
}

/** GET /demandes/{id}/compte-rendu (spec 8.8) */
export interface CompteRendu {
  nomFichier: string;
  /** Relative et signée (/uploads/...?exp=…&sig=…) : passer par mediaUrl() */
  url: string;
  urlExpireLe: string;
}