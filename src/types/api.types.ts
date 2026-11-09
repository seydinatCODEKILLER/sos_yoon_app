/** <Page> : enveloppe de toutes les listes paginées */
export interface Page<T> {
  contenu: T[];
  page: number;
  taille: number;
  totalElements: number;
  totalPages: number;
}

export interface PageParams {
  page?: number; // 0 par défaut
  taille?: number; // 20 par défaut, 100 maximum
}

/** Un élément de `details` : le champ en cause et le message. */
export interface ApiErreurDetail {
  champ: string;
  message: string;
}

/**
 * <Erreur> : format de toutes les erreurs 4xx et 5xx.
 * `details` est une LISTE de { champ, message }, jamais un objet.
 * Les données utiles à l'écran y passent aussi, sous forme de texte :
 *   { champ: "tentativesRestantes", message: "2" }
 *   { champ: "retryAfterSeconds",   message: "840" }
 */
export interface ApiErreur {
  code: string;
  message: string;
  details?: ApiErreurDetail[];
  horodatage: string;
}