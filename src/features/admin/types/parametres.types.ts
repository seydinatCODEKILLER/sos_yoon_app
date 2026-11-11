/** Niveau d'accès : libellé du profil côté serveur (ADMIN, SUPER_ADMIN…). */
export type NiveauAdmin = "ADMIN" | "SUPER_ADMIN" | (string & {});

/** Spec 13.37. `mfaActive` n'est pas encore renvoyé par le serveur : on ne l'affiche pas. */
export interface ProfilAdmin {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  niveau: NiveauAdmin | null;
  /** yyyy-MM-dd */
  dateAffectation: string | null;
  photoUrl: string | null;
  mfaActive?: boolean;
}

/** Spec 13.38 */
export interface ProfilAdminPayload {
  prenom: string;
  nom: string;
  telephone: string;
}

/** Spec 13.39 : une « session » = un appareil connecté (un refresh token actif). */
export interface SessionAdmin {
  id: string;
  appareil: string | null;
  adresseIp: string | null;
  /** ISO UTC */
  dernierAcces: string | null;
  courante: boolean;
}

/** Spec 4.7 */
export interface ChangerMotDePassePayload {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

/** Spec 13.35 */
export interface ParametreAdmin {
  cle: string;
  valeur: string;
  description: string | null;
}

/** Spec 13.36 */
export interface ParametreModifie {
  cle: string;
  valeur: string;
}