import { apiClient } from "@/shared/lib/apiClient";
import type {
  CreerDemandeEcritePayload,
  CreerDemandeVocalePayload,
  DemandeCreee,
  DemandeDetail,
  DemandeResume,
  MotCleFrequent,
  SuiviDemande,
} from "../types/demande.types";

export interface DemandesApi {
  /** 8.1 : création + envoi en une seule requête (multipart) */
  creerEcrite(payload: CreerDemandeEcritePayload): Promise<DemandeCreee>;
  /** 8.1 : demande vocale, même route, avec le fichier audio */
  creerVocale(payload: CreerDemandeVocalePayload): Promise<DemandeCreee>;
  /** 8.3 */
  suivi(id: string): Promise<SuiviDemande>;
  /** 8.2 */
  detail(id: string): Promise<DemandeDetail>;
  /** 8.6 */
  annuler(id: string, motif?: string): Promise<DemandeDetail>;
  /** 8.7 : renvoie le suivi à jour (409 AUCUN_PROFESSIONNEL_SUIVANT si la file est vide) */
  reorienter(id: string): Promise<SuiviDemande>;
  /** 6.6 (public) */
  motsClesFrequents(): Promise<MotCleFrequent[]>;
  /** À MIGRER vers GET /demandes/moi à l'étape « liste » */
  lister(): Promise<DemandeResume[]>;
}

export const demandesApi: DemandesApi = {
  async creerEcrite({ description, motsCles, localisation }) {
    // Le backend attend un multipart : champ « donnees » = JSON sous forme de texte.
    // Ne pas fixer de Content-Type : le navigateur ajoute lui-même la boundary.
    const form = new FormData();
    form.append(
      "donnees",
      JSON.stringify({
        typeSaisie: "TEXTE",
        description,
        motsCles,
        localisation,
      }),
    );
    const { data } = await apiClient.post<DemandeCreee>("/demandes", form);
    return data;
  },

  async creerVocale({ fichier, dureeSecondes, motsCles, localisation }) {
    const extension = fichier.type.includes("mp4")
      ? "m4a"
      : fichier.type.includes("ogg")
        ? "ogg"
        : "webm";
    const form = new FormData();
    form.append(
      "donnees",
      JSON.stringify({ typeSaisie: "VOCAL", dureeSecondes, motsCles, localisation }),
    );
    form.append("fichier", fichier, `message-vocal.${extension}`);
    const { data } = await apiClient.post<DemandeCreee>("/demandes", form);
    return data;
  },

  async suivi(id) {
    const { data } = await apiClient.get<SuiviDemande>(`/demandes/${id}/suivi`);
    return data;
  },

  async detail(id) {
    const { data } = await apiClient.get<DemandeDetail>(`/demandes/${id}`);
    return data;
  },

  async annuler(id, motif) {
    const { data } = await apiClient.post<DemandeDetail>(
      `/demandes/${id}/annuler`,
      motif ? { motif } : {},
    );
    return data;
  },

  async reorienter(id) {
    const { data } = await apiClient.post<SuiviDemande>(
      `/demandes/${id}/reorienter`,
    );
    return data;
  },

  // Endpoint public (6.6)
  async motsClesFrequents() {
    const { data } = await apiClient.get<MotCleFrequent[]>(
      "/referentiels/mots-cles-frequents",
    );
    return data;
  },

  // TODO étape « liste » : GET /demandes/moi?statut=…&page=…&taille=… + /demandes/moi/compteurs
  async lister() {
    const { data } = await apiClient.get<DemandeResume[]>("/demandes");
    return data;
  },
};