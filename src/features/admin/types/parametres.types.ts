export type NiveauAdmin = "SUPER_ADMIN" | "ADMIN";

export interface ProfilAdmin {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string; // +221XXXXXXXXX
  niveau: NiveauAdmin;
  dateAffectation: string;
  photoUrl: string | null;
  mfaActive: boolean; // ignoré au MVP
}

export interface ProfilAdminPayload {
  prenom: string;
  nom: string;
  telephone: string;
}

export interface SessionAdmin {
  id: string;
  appareil: string;
  adresseIp: string;
  dernierAcces: string;
  courante: boolean;
}

export interface ChangerMotDePassePayload {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}