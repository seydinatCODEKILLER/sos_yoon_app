export type UserRole = "PARTICULIER" | "PRO" | "ADMIN";

export type Metier = "AVOCAT" | "HUISSIER" | "NOTAIRE" | "JURISTE_CONSEIL";

export type StatutCompte =
  | "ACTIF"
  | "EMAIL_A_VERIFIER"
  | "INSCRIPTION_EN_COURS"
  | "EN_ATTENTE_VALIDATION"
  | "REJETE"
  | "SUSPENDU_IMPAYE"
  | "SUSPENDU_ADMIN";

/** Ce que le compte a le droit d'appeler (spec, section 1) */
export type Portee =
  | "COMPLET"
  | "INSCRIPTION"
  | "DOSSIER"
  | "PAIEMENT"
  | "AUCUNE";

/** <TokenResponse>.utilisateur */
export interface User {
  id: string;
  role: UserRole;
  prenom: string | null;
  nom: string | null;
  photoUrl: string | null;
  telephone: string; // format international : +221771234567
  email: string | null;
  statutCompte: StatutCompte;
  telephoneVerifie: boolean;
  emailVerifie: boolean;
  profilComplete: boolean;
}