export interface Region {
  id: string; // UUID
  nom: string;
}

/** Zone / quartier habituel : { id, libelle } dans le profil */
export interface ZoneRef {
  id: string;
  libelle: string; // "Pikine (Pikine Ouest / Tally Boubess)"
}

/** Zone renvoyée par GET /referentiels/zones */
export interface Zone extends ZoneRef {
  regionId: string;
  /** Centre de la zone ; null si non renseigné (zone inutilisable pour localiser une demande) */
  latitudeCentre?: number | null;
  longitudeCentre?: number | null;
}

/** <ProfilParticulier> (spec §2) */
export interface ProfilParticulier {
  id: string;
  /** Format international : "+221771234513" */
  telephone: string;
  telephoneVerifie: boolean;
  /** null tant que le profil n'est pas complété */
  prenom: string | null;
  nom: string | null;
  email: string | null;
  /** Peut être une URL relative : passer par mediaUrl() pour l'afficher */
  photoUrl: string | null;
  region: Region | null;
  zone: ZoneRef | null;
  languePreferee: string | null;
  /** false tant que prénom et nom sont vides */
  profilComplete: boolean;
  /** false si le compte a été créé sans code secret (parcours « demande d'abord ») */
  codeSecretDefini: boolean;
  /** ISO */
  dateInscription: string;
}

/**
 * PUT /particulier/profil
 * Un champ absent ne change rien ; une chaîne vide EFFACE la valeur.
 * On envoie donc toujours les cinq champs, avec "" pour « vide ».
 */
export interface ModifierProfilPayload {
  prenom: string;
  nom: string;
  email: string;
  regionId: string;
  zoneId: string;
}

/** POST /particulier/code-secret : codeActuel absent si aucun code n'est encore défini */
export interface ChangerCodeSecretPayload {
  codeActuel?: string;
  nouveauCode: string;
}

/** DELETE /particulier/compte */
export interface SupprimerComptePayload {
  codeSecret: string;
}

/** POST /particulier/telephone/demander-changement */
export interface DemanderChangementTelephonePayload {
  /** Format international : "+221781112233" */
  nouveauTelephone: string;
}

/** Réponse (202) de demander-changement */
export interface EnvoiCodeTelephone {
  expiration: string; // ISO 8601
  delaiRenvoiSecondes: number;
}

/** POST /particulier/telephone/confirmer-changement */
export interface ConfirmerChangementTelephonePayload {
  code: string; // 6 chiffres
}