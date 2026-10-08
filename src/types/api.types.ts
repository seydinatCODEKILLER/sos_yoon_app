/** <Page> : enveloppe de toutes les listes paginées */
export interface Page<T> {
  contenu: T[];
  page: number; // à partir de 0
  taille: number;
  totalElements: number;
  totalPages: number;
}

export interface PageParams {
  page?: number; // 0 par défaut
  taille?: number; // 20 par défaut, 100 maximum
}

/** <Erreur> : format de toutes les erreurs 4xx et 5xx */
export interface ApiErreur {
  code: string;
  message: string;
  details?: { champ: string; message: string }[];
  horodatage: string;
}