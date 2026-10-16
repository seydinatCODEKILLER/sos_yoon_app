export interface ProfilParticulier {
  id: string;
  prenom: string;
  nom: string;
  email: string | null;
  /** Format international : "+221771234513" */
  telephone: string;
  /** Libellé de la commune : "Pikine" */
  zoneHabituelle: string | null;
  photoUrl: string | null;
  /** ISO */
  dateInscription: string;

  regionId: number | null;
  communeId: number | null;
}

export interface ChangerCodeSecretPayload {
  codeActuel: string;
  nouveauCode: string;
}

export interface Region {
  id: number;
  nom: string;
}

export interface ModifierProfilPayload {
  prenom: string;
  nom: string;
  /** null si l'utilisateur n'en renseigne pas */
  email: string | null;
  regionId: number | null;
  communeId: number | null;
}

export interface SupprimerComptePayload {
  codeSecret: string;
}