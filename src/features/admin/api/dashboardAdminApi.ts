import { apiClient } from "@/shared/lib/apiClient";
import type {
  EvolutionDemandes,
  TableauDeBordAdmin,
  VueEvolution,
} from "../types/dashboard.types";

export interface DashboardAdminApi {
  tableauDeBord(): Promise<TableauDeBordAdmin>;
  evolution(vue: VueEvolution): Promise<EvolutionDemandes>;
}

export const dashboardAdminApi: DashboardAdminApi = {
  async tableauDeBord() {
    const { data } = await apiClient.get<TableauDeBordAdmin>("/admin/tableau-de-bord");
    return data;
  },

  async evolution(vue) {
    const { data } = await apiClient.get<EvolutionDemandes>("/admin/tableau-de-bord/evolution", {
      params: { vue },
    });
    return data;
  },
};