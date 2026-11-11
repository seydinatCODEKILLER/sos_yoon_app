import { apiClient } from "@/shared/lib/apiClient";
import type { TokenResponse } from "../types/types";

export interface LoginAdminPayload {
  email: string;
  motDePasse: string;
}

/**
 * Spec 13.1 : réponse du serveur à la connexion administrateur.
 * Au MVP, c'est toujours un TokenResponse. Quand la double authentification sera activée
 * pour un compte (phase P2), le serveur répondra { mfaRequis: true, jetonMfa } à la place.
 */
export interface MfaRequise {
  mfaRequis: true;
  jetonMfa: string;
}

export type ReponseConnexionAdmin = TokenResponse | MfaRequise;

export function mfaEstRequise(r: ReponseConnexionAdmin): r is MfaRequise {
  return "mfaRequis" in r && r.mfaRequis === true;
}

export const adminAuthApi = {
  /**
   * POST /admin/auth/connexion : endpoint public, il doit figurer dans PUBLIC_ENDPOINTS de
   * apiClient (pas de jeton envoyé, pas de tentative de refresh sur le 401 IDENTIFIANTS_INVALIDES).
   */
  async connexion(payload: LoginAdminPayload): Promise<ReponseConnexionAdmin> {
    const { data } = await apiClient.post<ReponseConnexionAdmin>(
      "/admin/auth/connexion",
      payload,
    );
    return data;
  },
};