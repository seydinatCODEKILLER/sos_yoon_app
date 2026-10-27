import { apiClient } from "@/shared/lib/apiClient";
import type {
  AbonnementPro,
  Periode,
  SollicitationAcceptee,
  TableauDeBord,
} from "../types/dashboard.types";

export interface DashboardApi {
  tableauDeBord(periode: Periode): Promise<TableauDeBord>;
  changerDisponibilite(disponible: boolean): Promise<void>;
  abonnement(): Promise<AbonnementPro>;
  accepterSollicitation(id: string): Promise<SollicitationAcceptee>;
}

export const dashboardApi: DashboardApi = {
  async tableauDeBord(periode) {
    const { data } = await apiClient.get<TableauDeBord>(
      "/pro/tableau-de-bord",
      { params: { periode } },
    );
    return data;
  },

  async changerDisponibilite(disponible) {
    await apiClient.put("/pro/disponibilite", { disponible });
  },

  async abonnement() {
    const { data } = await apiClient.get<AbonnementPro>("/pro/abonnement");
    return data;
  },

  async accepterSollicitation(id) {
    const { data } = await apiClient.post<SollicitationAcceptee>(
      `/pro/sollicitations/${id}/accepter`,
    );
    return data;
  },
};