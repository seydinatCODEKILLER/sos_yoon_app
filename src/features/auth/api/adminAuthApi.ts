import { apiClient } from "@/shared/lib/apiClient";
import type { TokenResponse } from "../types/types";

export interface LoginAdminPayload {
  email: string;
  motDePasse: string;
}

export const adminAuthApi = {
  /** Sans double authentification, la réponse est un TokenResponse (voir 13.1) */
  async connexion(payload: LoginAdminPayload): Promise<TokenResponse> {
    const { data } = await apiClient.post<TokenResponse>("/admin/auth/connexion", payload);
    return data;
  },
};