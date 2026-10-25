import { api } from "@/shared/lib/apiClient";
import type {
  AdminConnexionResponse,
  ChangerMotDePassePayload,
  CodeEnvoye,
  DefinirCodeSecretPayload,
  DemanderCodeConnexionPayload,
  DemanderCodeInscriptionPayload,
  DemanderCodeReinitialisationPayload,
  EmailPayload,
  FinaliserInscriptionPayload,
  LoginParticulierPayload,
  LoginProPayload,
  RegisterProPayload,
  ReinitialiserCodeSecretPayload,
  ReinitialiserMotDePassePayload,
  RenvoyerCodePayload,
  TokenResponse,
  VerifierCodeInscriptionResponse,
  VerifierCodePayload,
  VerifierCodeReinitialisationResponse,
  VerifierEmailPayload,
  VerifierEmailResponse,
  VerifierMfaPayload,
} from "../types/types";

/** Le back renvoie l'objet directement : on renvoie `data` tel quel. */
async function post<T>(
  url: string,
  body?: object,
  config?: object,
): Promise<T> {
  const { data } = await api.post<T>(url, body, config);
  return data;
}

async function put<T>(url: string, body?: object): Promise<T> {
  const { data } = await api.put<T>(url, body);
  return data;
}

export const authApi = {
  /* ── Particulier : code SMS, pas de mot de passe ── */
  particulier: {
    /** 202 */
    demanderCodeInscription: (payload: DemanderCodeInscriptionPayload) =>
      post<CodeEnvoye>("/auth/particulier/inscription/demander-code", payload),

    /** 202 */
    demanderCodeConnexion: (payload: DemanderCodeConnexionPayload) =>
      post<CodeEnvoye>("/auth/particulier/connexion/demander-code", payload),

    /** 200 */
    verifierCodeConnexion: (payload: VerifierCodePayload) =>
      post<TokenResponse>("/auth/particulier/connexion/verifier-code", payload),

    /** 200 */
    connexion: (payload: LoginParticulierPayload) =>
      post<TokenResponse>("/auth/particulier/connexion", payload),

    /** 200 : le SMS est valide, le compte n'est pas encore créé */
    verifierCodeInscription: (payload: VerifierCodePayload) =>
      post<VerifierCodeInscriptionResponse>(
        "/auth/particulier/inscription/verifier-code",
        payload,
      ),

    /** 201 : crée le compte et connecte */
    definirCodeSecret: (payload: DefinirCodeSecretPayload) =>
      post<TokenResponse>(
        "/auth/particulier/inscription/definir-code-secret",
        payload,
      ),

    /** 201 : crée le compte sans code secret et connecte (parcours « demande d'abord ») */
    finaliserInscription: (payload: FinaliserInscriptionPayload) =>
      post<TokenResponse>("/auth/particulier/inscription/finaliser", payload),

    /** 202, répond toujours 202 même si le numéro est inconnu */
    demanderCodeReinitialisation: (
      payload: DemanderCodeReinitialisationPayload,
    ) =>
      post<CodeEnvoye>("/auth/particulier/code-oublie/demander-code", payload),

    /** 200 */
    verifierCodeReinitialisation: (payload: VerifierCodePayload) =>
      post<VerifierCodeReinitialisationResponse>(
        "/auth/particulier/code-oublie/verifier-code",
        payload,
      ),

    /** 204 : l'utilisateur doit ensuite se reconnecter */
    reinitialiserCodeSecret: (payload: ReinitialiserCodeSecretPayload) =>
      post<void>("/auth/particulier/code-oublie/reinitialiser", payload),

    /** 202 : `type` indique le parcours en cours */
    renvoyerCode: (payload: RenvoyerCodePayload) =>
      post<CodeEnvoye>("/auth/particulier/renvoyer-code", payload),
  },

  /* ── Professionnel : email + mot de passe ── */
  pro: {
    /** 201 : compte créé, portée INSCRIPTION, email à vérifier */
    inscription: (payload: RegisterProPayload) =>
      post<TokenResponse>("/auth/pro/inscription", payload),

    /** 200 : la portée dit quel écran afficher */
    connexion: (payload: LoginProPayload) =>
      post<TokenResponse>("/auth/pro/connexion", payload),
  },

  /* ── Email ── */
  email: {
    verifier: (payload: VerifierEmailPayload) =>
      post<VerifierEmailResponse>("/auth/email/verifier", payload),

    /** 202, répond toujours 202 même si l'adresse est inconnue */
    renvoyer: (payload: EmailPayload) =>
      post<void>("/auth/email/renvoyer", payload),
  },

  /* ── Mots de passe (pro, admin) ── */
  motDePasse: {
    /** 202, répond toujours 202 */
    oublie: (payload: EmailPayload) =>
      post<void>("/auth/mot-de-passe-oublie", payload),

    /** 204 */
    reinitialiser: (payload: ReinitialiserMotDePassePayload) =>
      post<void>("/auth/mot-de-passe/reinitialiser", payload),

    /** 204 : utilisateur connecté */
    changer: (payload: ChangerMotDePassePayload) =>
      put<void>("/auth/mot-de-passe", payload),
  },

  /* ── Administrateur ── */
  admin: {
    /** TokenResponse, ou { mfaRequis, jetonMfa } si la double authentification est activée (P2) */
    connexion: (payload: LoginProPayload) =>
      post<AdminConnexionResponse>("/admin/auth/connexion", payload),

    /** P2 */
    verifierMfa: (payload: VerifierMfaPayload) =>
      post<TokenResponse>("/admin/auth/2fa/verifier", payload),
  },

  /* ── Session ── */

  /**
   * 204. `_retry: true` empêche l'intercepteur de rafraîchir puis de rejouer
   * cette requête : le refresh token qu'on veut révoquer serait déjà remplacé.
   * Le rafraîchissement lui-même vit dans shared/lib/refreshToken.ts.
   */
  deconnexion: (refreshToken: string) =>
    post<void>("/auth/deconnexion", { refreshToken }, { _retry: true }),
};
