import { apiClient } from "@/shared/lib/apiClient";
import type {
  ChangementStatutProPayload,
  CompteursProfessionnels,
  DossierEnCours,
  FichierSigne,
  MotifAdmin,
  PageProfessionnels,
  ParamsProfessionnels,
  ProfessionnelAdminDetail,
  RefusDossierPayload,
  ReponseChangementStatut,
  TypeMotifPro,
} from "../types/professionnels.types";

/** Spec 13.14 à 13.23 et 13.33. */
export const professionnelsAdminApi = {
  async lister(p: ParamsProfessionnels): Promise<PageProfessionnels> {
    const { data } = await apiClient.get<PageProfessionnels>("/admin/professionnels", {
      params: {
        q: p.q || undefined,
        statut: p.statut,
        metier: p.metier === "TOUS" ? undefined : p.metier,
        page: p.page,
        taille: p.taille,
      },
    });
    return data;
  },

  async compteurs(): Promise<CompteursProfessionnels> {
    const { data } = await apiClient.get<CompteursProfessionnels>(
      "/admin/professionnels/compteurs",
    );
    return data;
  },

  async detail(id: string): Promise<ProfessionnelAdminDetail> {
    const { data } = await apiClient.get<ProfessionnelAdminDetail>(
      `/admin/professionnels/${id}`,
    );
    return data;
  },

  /** Lien signé, consultation tracée dans le journal d'audit : à n'appeler qu'au clic. */
  async lienDocument(id: string, documentId: string): Promise<FichierSigne> {
    const { data } = await apiClient.get<FichierSigne>(
      `/admin/professionnels/${id}/documents/${documentId}/telecharger`,
    );
    return data;
  },

  async motifs(type: TypeMotifPro): Promise<MotifAdmin[]> {
    const { data } = await apiClient.get<MotifAdmin[]>("/admin/motifs", { params: { type } });
    return data;
  },

  async desactiver(id: string, payload: ChangementStatutProPayload): Promise<ReponseChangementStatut> {
    const { data } = await apiClient.post<ReponseChangementStatut>(
      `/admin/professionnels/${id}/desactiver`,
      payload,
    );
    return data;
  },

  async reactiver(id: string, payload: ChangementStatutProPayload): Promise<ReponseChangementStatut> {
    const { data } = await apiClient.post<ReponseChangementStatut>(
      `/admin/professionnels/${id}/reactiver`,
      payload,
    );
    return data;
  },

  async dossiersEnCours(id: string): Promise<DossierEnCours[]> {
    const { data } = await apiClient.get<DossierEnCours[]>(
      `/admin/professionnels/${id}/dossiers-en-cours`,
    );
    return data;
  },

  async approuver(dossierId: string, commentaire?: string) {
    const { data } = await apiClient.post(
      `/admin/dossiers-pro/${dossierId}/approuver`,
      commentaire ? { commentaire } : undefined,
    );
    return data;
  },

  async rejeter(dossierId: string, payload: RefusDossierPayload) {
    const { data } = await apiClient.post(`/admin/dossiers-pro/${dossierId}/rejeter`, payload);
    return data;
  },
};