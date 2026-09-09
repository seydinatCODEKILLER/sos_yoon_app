import type {
  ApiSuccessResponse,
  PaginatedApiResponse,
} from "@/types/api.types";

import { api } from "@/shared/lib/apiClient";
import type {
  CreateDemandePayload,
  Demande,
  ListDemandesFilters,
} from "../types/demande.types";

export const demandeApi = {
  create: async (payload: CreateDemandePayload): Promise<Demande> => {
    const { data } = await api.post<ApiSuccessResponse<Demande>>(
      "/demandes",
      payload,
    );
    return data.data;
  },

  getById: async (id: string): Promise<Demande> => {
    const { data } = await api.get<ApiSuccessResponse<Demande>>(
      `/demandes/${id}`,
    );
    return data.data;
  },

  listMine: async (
    filters: ListDemandesFilters = {},
  ): Promise<PaginatedApiResponse<Demande>> => {
    const { data } = await api.get<PaginatedApiResponse<Demande>>("/demandes", {
      params: { page: filters.page, limit: filters.limit },
    });
    return data;
  },
};
