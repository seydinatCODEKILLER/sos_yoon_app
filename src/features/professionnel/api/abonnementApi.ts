import { apiClient } from "@/shared/lib/apiClient";
import type {
  AbonnementDetail,
  PagePaiements,
  PaiementInitie,
  PayerPayload,
} from "../types/abonnement.types";

export interface AbonnementApi {
  detail(): Promise<AbonnementDetail>;
  paiements(page: number, taille: number): Promise<PagePaiements>;
  payer(payload: PayerPayload): Promise<PaiementInitie>;
}

export const abonnementApi: AbonnementApi = {
  async detail() {
    const { data } = await apiClient.get<AbonnementDetail>("/pro/abonnement");
    return data;
  },

  async paiements(page, taille) {
    const { data } = await apiClient.get<PagePaiements>("/pro/abonnement/paiements", {
      params: { page, taille },
    });
    return data;
  },

  async payer(payload) {
    const { data } = await apiClient.post<PaiementInitie>("/pro/abonnement/paiements", payload);
    return data;
  },
};