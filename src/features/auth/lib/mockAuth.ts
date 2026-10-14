import type { ApiErreur } from "@/types/api.types";
import type {
  CodeEnvoye,
  DefinirCodeSecretPayload,
  LoginParticulierPayload,
  LoginProPayload,
  ReinitialiserCodeSecretPayload,
  TokenResponse,
  TypeCode,
  VerifierCodePayload,
} from "../types/types";
import type { User, UserRole } from "@/types/user.types";

/** TODO : à supprimer une fois le back-end connecté. */

/** Mettez "ADMIN" ici pour tester l'espace admin via la connexion particulier. */
const DEV_ROLE: UserRole | null = null;

let telephoneInscription = "+221770000000";

/** Un code « 000000 » simule OTP_INVALIDE, tout autre code à 6 chiffres passe. */
const INVALID_CODE = "000000";

const CODE_SECRET_INVALIDE = "0000"; // simule un mauvais code
let essaisRestants = 4;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function erreur(code: string, message: string): ApiErreur {
  return { code, message, horodatage: new Date().toISOString() };
}

async function codeEnvoye(): Promise<CodeEnvoye> {
  await wait(400);
  return {
    expiration: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    delaiRenvoiSecondes: 60,
  };
}

function buildSession(role: UserRole, overrides: Partial<User>): TokenResponse {
  return {
    accessToken: `mock-access-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
    expiresIn: 900,
    portee: "COMPLET",
    utilisateur: {
      id: `mock-${Date.now()}`,
      role,
      prenom: "Seydina",
      nom: "Thiam",
      photoUrl: null,
      telephone: "+221770000000",
      email: null,
      statutCompte: "ACTIF",
      telephoneVerifie: true,
      emailVerifie: false,
      profilComplete: true,
      ...overrides,
    },
  };
}

async function verifier(
  { telephone, code }: VerifierCodePayload,
  type: TypeCode,
): Promise<TokenResponse> {
  await wait(500);
  if (code === INVALID_CODE) {
    throw erreur("OTP_INVALIDE", "Le code saisi est incorrect.");
  }
  const nouveau = type === "INSCRIPTION";
  return buildSession(DEV_ROLE ?? "PARTICULIER", {
    telephone,
    // un compte fraîchement créé n'a pas encore de nom
    prenom: nouveau ? null : "Seydina",
    nom: nouveau ? null : "Thiam",
    profilComplete: !nouveau,
  });
}

export const mockAuthApi = {
  particulier: {
    demanderCodeInscription: () => codeEnvoye(),
    demanderCodeConnexion: () => codeEnvoye(),
    renvoyerCode: () => codeEnvoye(),
    demanderCodeReinitialisation: () => codeEnvoye(),
verifierCodeReinitialisation: async ({ code }: VerifierCodePayload) => {
  await wait(500);
  if (code === INVALID_CODE) throw erreur("OTP_INVALIDE", "Le code saisi est incorrect.");
  return { jetonReinitialisation: `mock-reset-${Date.now()}` };
},
reinitialiserCodeSecret: async (_: ReinitialiserCodeSecretPayload) => {
  await wait(500);
},

    // dans mockAuthApi.particulier (supprimez demanderCodeConnexion et verifierCodeConnexion)
    connexion: async ({ telephone, codeSecret }: LoginParticulierPayload) => {
      await wait(500);
      if (codeSecret === CODE_SECRET_INVALIDE) {
        essaisRestants -= 1;
        if (essaisRestants < 0) {
          throw erreur("COMPTE_VERROUILLE", "Trop de tentatives.");
        }
        throw {
          ...erreur("CODE_SECRET_INCORRECT", "Code incorrect."),
          details: { essaisRestants },
        };
      }
      essaisRestants = 4;
      return buildSession(DEV_ROLE ?? "PARTICULIER", { telephone });
    },
    verifierCodeInscription: async ({
      telephone,
      code,
    }: VerifierCodePayload) => {
      await wait(500);
      if (code === INVALID_CODE)
        throw erreur("OTP_INVALIDE", "Le code saisi est incorrect.");
      telephoneInscription = telephone;
      return { jetonInscription: `mock-jeton-${Date.now()}` };
    },
    definirCodeSecret: async (_: DefinirCodeSecretPayload) => {
      await wait(500);
      return buildSession(DEV_ROLE ?? "PARTICULIER", {
        telephone: telephoneInscription,
        prenom: null,
        nom: null,
        profilComplete: false,
      });
    },
  },
  pro: {
    connexion: async (p: LoginProPayload) => {
      await wait(500);
      return buildSession("PRO", {
        prenom: "Abdou",
        nom: "Ndiaye",
        email: p.email,
        emailVerifie: true,
      });
    },
  },
};
