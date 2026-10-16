import { apiClient } from "@/shared/lib/apiClient";
import type {
  Commune,
  CreerDemandePayload,
  DemandeAudio,
  DemandeDetail,
  DemandeResume,
  EnvoyerAudioPayload,
  LocalisationPayload,
  LocalisationResultat,
  ModifierDemandePayload,
  MotCleFrequent,
  SuiviDemande,
} from "../types/demande.types";

export interface DemandesApi {
  creer(payload: CreerDemandePayload): Promise<DemandeDetail>;
  lister(): Promise<DemandeResume[]>;
  modifier(id: string, payload: ModifierDemandePayload): Promise<DemandeDetail>;
  motsClesFrequents(): Promise<MotCleFrequent[]>;
  envoyerAudio(id: string, payload: EnvoyerAudioPayload): Promise<DemandeAudio>;
  definirLocalisation(
    id: string,
    payload: LocalisationPayload,
  ): Promise<LocalisationResultat>;
  envoyer(id: string): Promise<DemandeDetail>;
  communes(): Promise<Commune[]>;
  suivi(id: string): Promise<SuiviDemande>;
  annuler(id: string): Promise<void>;
  elargir(id: string): Promise<void>;
  lister(): Promise<DemandeResume[]>;
}

export const demandesApi: DemandesApi = {
  creer: async (payload) =>
    (await apiClient.post<DemandeDetail>("/demandes", payload)).data,

  modifier: async (id, payload) =>
    (await apiClient.put<DemandeDetail>(`/demandes/${id}`, payload)).data,

  // Endpoint public (section 6.8) ; à déplacer dans shared/ quand d'autres features auront besoin des référentiels
  motsClesFrequents: async () =>
    (await apiClient.get<MotCleFrequent[]>("/referentiels/mots-cles-frequents"))
      .data,

  envoyerAudio: async (id, { fichier, dureeSecondes }) => {
    const form = new FormData();
    const extension = fichier.type.includes("mp4")
      ? "m4a"
      : fichier.type.includes("ogg")
        ? "ogg"
        : "webm";
    form.append("fichier", fichier, `message.${extension}`);
    form.append("dureeSecondes", String(dureeSecondes));
    // Axios retire lui-même le Content-Type JSON pour un FormData
    return (await apiClient.post<DemandeAudio>(`/demandes/${id}/audio`, form))
      .data;
  },

  async definirLocalisation(id, payload) {
    const { data } = await apiClient.put<LocalisationResultat>(
      `/demandes/${id}/localisation`,
      payload,
    );
    return data;
  },

  async envoyer(id) {
    const { data } = await apiClient.post<DemandeDetail>(
      `/demandes/${id}/envoyer`,
    );
    return data;
  },

  async communes() {
    const { data } = await apiClient.get<Commune[]>("/referentiels/communes");
    return data;
  },

  async suivi(id) {
    const { data } = await apiClient.get<SuiviDemande>(`/demandes/${id}/suivi`);
    return data;
  },

  async annuler(id) {
    await apiClient.post(`/demandes/${id}/annuler`);
  },

  async elargir(id) {
    await apiClient.post(`/demandes/${id}/elargir`);
  },

  async lister() {
    const { data } = await apiClient.get<DemandeResume[]>("/demandes");
    return data;
  },
};
