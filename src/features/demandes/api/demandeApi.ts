import { apiClient } from "@/shared/lib/apiClient";
import type {
  CreerDemandePayload,
  DemandeAudio,
  DemandeDetail,
  EnvoyerAudioPayload,
  ModifierDemandePayload,
  MotCleFrequent,
} from "../types/demande.types";

export interface DemandesApi {
  creer(payload: CreerDemandePayload): Promise<DemandeDetail>;
  modifier(id: string, payload: ModifierDemandePayload): Promise<DemandeDetail>;
  motsClesFrequents(): Promise<MotCleFrequent[]>;
  envoyerAudio(id: string, payload: EnvoyerAudioPayload): Promise<DemandeAudio>;
}

export const demandesApi: DemandesApi = {
  creer: async (payload) =>
    (await apiClient.post<DemandeDetail>("/demandes", payload)).data,

  modifier: async (id, payload) =>
    (await apiClient.put<DemandeDetail>(`/demandes/${id}`, payload)).data,

  // Endpoint public (section 6.8) ; à déplacer dans shared/ quand d'autres features auront besoin des référentiels
  motsClesFrequents: async () =>
    (await apiClient.get<MotCleFrequent[]>("/referentiels/mots-cles-frequents")).data,

    envoyerAudio: async (id, { fichier, dureeSecondes }) => {
    const form = new FormData();
    const extension = fichier.type.includes("mp4") ? "m4a" : fichier.type.includes("ogg") ? "ogg" : "webm";
    form.append("fichier", fichier, `message.${extension}`);
    form.append("dureeSecondes", String(dureeSecondes));
    // Axios retire lui-même le Content-Type JSON pour un FormData
    return (await apiClient.post<DemandeAudio>(`/demandes/${id}/audio`, form)).data;
  },
};