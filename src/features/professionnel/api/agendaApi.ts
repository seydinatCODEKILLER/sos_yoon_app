import { apiClient } from "@/shared/lib/apiClient";
import type { RendezVous, RendezVousPayload } from "../types/agenda.types";

export interface AgendaApi {
  /** debut et fin : dates AAAA-MM-JJ, bornes incluses */
  lister(debut: string, fin: string): Promise<RendezVous[]>;
  creer(payload: RendezVousPayload): Promise<RendezVous>;
  modifier(id: string, payload: RendezVousPayload): Promise<RendezVous>;
  supprimer(id: string): Promise<void>;
}

export const agendaApi: AgendaApi = {
  async lister(debut, fin) {
    const { data } = await apiClient.get<RendezVous[]>("/pro/agenda", {
      params: { debut, fin },
    });
    return data;
  },

  async creer(payload) {
    const { data } = await apiClient.post<RendezVous>("/pro/agenda", payload);
    return data;
  },

  async modifier(id, payload) {
    const { data } = await apiClient.put<RendezVous>(`/pro/agenda/${id}`, payload);
    return data;
  },

  async supprimer(id) {
    await apiClient.delete(`/pro/agenda/${id}`);
  },
};