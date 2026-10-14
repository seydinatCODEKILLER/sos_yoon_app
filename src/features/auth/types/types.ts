import type { Portee, StatutCompte, User } from "@/types/user.types";

/* ── Réponses ── */

/** <TokenResponse> : inscription, connexion, rafraîchissement */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // secondes (900)
  portee: Portee;
  utilisateur: User;
}

/** Réponse (202) de demander-code et renvoyer-code */
export interface CodeEnvoye {
  expiration: string; // ISO 8601
  delaiRenvoiSecondes: number;
}

/* ── Particulier (SMS, sans mot de passe) ── */

/** POST /auth/particulier/inscription/demander-code */
export interface DemanderCodeInscriptionPayload {
  telephone: string;
  cguAcceptees: boolean;
  versionCgu: string;
}

/** POST /auth/particulier/connexion/demander-code */
export interface DemanderCodeConnexionPayload {
  telephone: string;
}

export type TypeCode = "INSCRIPTION" | "REINITIALISATION"; // CONNEXION n'existe plus

/** POST /auth/particulier/code-oublie/demander-code */
export interface DemanderCodeReinitialisationPayload {
  telephone: string;
}

/** Réponse de .../code-oublie/verifier-code (200) */
export interface VerifierCodeReinitialisationResponse {
  jetonReinitialisation: string; // courte durée de vie
}

/** POST /auth/particulier/code-oublie/reinitialiser */
export interface ReinitialiserCodeSecretPayload {
  jetonReinitialisation: string;
  nouveauCodeSecret: string; // 4 chiffres
}

/** POST /auth/particulier/{inscription|connexion}/verifier-code */
export interface VerifierCodePayload {
  telephone: string;
  code: string;
}

/** POST /auth/particulier/renvoyer-code */
export interface RenvoyerCodePayload {
  telephone: string;
  type: TypeCode;
}

/* ── Professionnel (email + mot de passe) ── */

/** POST /auth/pro/inscription */
export interface RegisterProPayload {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  motDePasse: string;
  confirmationMotDePasse: string;
  cguAcceptees: boolean;
  versionCgu: string;
}

/** POST /auth/pro/connexion */
export interface LoginProPayload {
  email: string;
  motDePasse: string;
}

/** POST /auth/particulier/connexion */
export interface LoginParticulierPayload {
  telephone: string;
  codeSecret: string; // 4 chiffres
}

/** POST /auth/email/verifier */
export interface VerifierEmailPayload {
  token: string;
}
export interface VerifierEmailResponse {
  emailVerifie: boolean;
  statutCompte: StatutCompte;
}

/* ── Mots de passe (pro, admin) ── */

/** POST /auth/mot-de-passe-oublie et /auth/email/renvoyer */
export interface EmailPayload {
  email: string;
}

/** POST /auth/mot-de-passe/reinitialiser */
export interface ReinitialiserMotDePassePayload {
  token: string;
  nouveauMotDePasse: string;
  confirmation: string;
}

/** PUT /auth/mot-de-passe */
export interface ChangerMotDePassePayload {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

/* ── Transversal ── */

/** POST /auth/rafraichir et /auth/deconnexion */
export interface RefreshPayload {
  refreshToken: string;
}

/** Admin avec double authentification activée (P2) */
export interface MfaRequis {
  mfaRequis: true;
  jetonMfa: string;
}
export type AdminConnexionResponse = TokenResponse | MfaRequis;

/** POST /admin/auth/2fa/verifier */
export interface VerifierMfaPayload {
  jetonMfa: string;
  code: string;
}

/** Réponse de POST /auth/particulier/inscription/verifier-code (200) */
export interface VerifierCodeInscriptionResponse {
  jetonInscription: string; // courte durée de vie
}

/** POST /auth/particulier/inscription/definir-code-secret */
export interface DefinirCodeSecretPayload {
  jetonInscription: string;
  codeSecret: string; // 4 chiffres
}