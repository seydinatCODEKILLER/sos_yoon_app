import { apiClient } from "@/shared/lib/apiClient";
import { tokenManager } from "@/shared/lib/tokenManager";
import type {
  ChangerMotDePassePayload,
  ParametreAdmin,
  ParametreModifie,
  ProfilAdmin,
  ProfilAdminPayload,
  SessionAdmin,
} from "../types/parametres.types";

/**
 * Le serveur ne peut pas deviner quel appareil fait la requête : les sessions sont des refresh
 * tokens. On lui envoie donc celui de cet appareil pour qu'il sache laquelle est « courante »
 * (marquage, et protection contre la révocation de sa propre session).
 */
function enteteSessionCourante(): Record<string, string> | undefined {
  const gestionnaire = tokenManager as unknown as { getRefreshToken?: () => string | null | undefined };
  const jeton = gestionnaire.getRefreshToken?.();
  return jeton ? { "X-Refresh-Token": jeton } : undefined;
}

/** Spec 13.35 à 13.41 et 4.7. */
export const parametresAdminApi = {
  async profil(): Promise<ProfilAdmin> {
    const { data } = await apiClient.get<ProfilAdmin>("/admin/profil");
    return data;
  },

  async modifierProfil(payload: ProfilAdminPayload): Promise<ProfilAdmin> {
    const { data } = await apiClient.put<ProfilAdmin>("/admin/profil", payload);
    return data;
  },

  async sessions(): Promise<SessionAdmin[]> {
    const { data } = await apiClient.get<SessionAdmin[]>("/admin/sessions", {
      headers: enteteSessionCourante(),
    });
    return data;
  },

  async deconnecterSession(id: string): Promise<void> {
    await apiClient.delete(`/admin/sessions/${encodeURIComponent(id)}`, { headers: enteteSessionCourante() });
  },

  async deconnecterAutresSessions(): Promise<void> {
    await apiClient.delete("/admin/sessions", { headers: enteteSessionCourante() });
  },

  async changerMotDePasse(payload: ChangerMotDePassePayload): Promise<void> {
    await apiClient.put("/auth/mot-de-passe", payload);
  },

  async parametres(): Promise<ParametreAdmin[]> {
    const { data } = await apiClient.get<ParametreAdmin[]>("/admin/parametres");
    return data;
  },

  async modifierParametre(cle: string, valeur: string): Promise<ParametreModifie> {
    const { data } = await apiClient.put<ParametreModifie>(`/admin/parametres/${encodeURIComponent(cle)}`, { valeur });
    return data;
  },
};