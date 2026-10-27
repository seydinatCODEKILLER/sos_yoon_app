import { apiClient } from "@/shared/lib/apiClient";
import type {
  OngletSollicitations,
  PageSollicitations,
  RefusPayload,
  RefusResultat,
  SollicitationDetail,
} from "../types/sollicitation.types";

export interface SollicitationsApi {
  lister(
    onglet: OngletSollicitations,
    page: number,
    taille: number,
  ): Promise<PageSollicitations>;
  detail(id: string): Promise<SollicitationDetail>;
  refuser(id: string, payload: RefusPayload): Promise<RefusResultat>;
}

export const sollicitationsApi: SollicitationsApi = {
  async lister(onglet, page, taille) {
    const { data } = await apiClient.get<PageSollicitations>(
      "/pro/sollicitations",
      { params: { onglet, page, taille } },
    );
    return data;
  },

  async detail(id) {
    const { data } = await apiClient.get<SollicitationDetail>(
      `/pro/sollicitations/${id}`,
    );
    return data;
  },

  async refuser(id, payload) {
    const { data } = await apiClient.post<RefusResultat>(
      `/pro/sollicitations/${id}/refuser`,
      payload,
    );
    return data;
  },
};