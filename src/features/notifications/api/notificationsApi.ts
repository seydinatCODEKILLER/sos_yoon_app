import { apiClient } from "@/shared/lib/apiClient";
import type { Page } from "@/types/api.types";
import type {
  CompteursNotifications,
  FiltreNotifications,
  Notification,
} from "../types/notification.types";

/** Spec §10 : même contrat que côté professionnel. Le backend ne sait filtrer que TOUTES / NON_LUES. */
export const notificationsApi = {
  async lister(
    filtre: FiltreNotifications,
    page: number,
    taille: number,
  ): Promise<Page<Notification>> {
    const { data } = await apiClient.get<Page<Notification>>("/notifications", {
      params: { filtre, page, taille },
    });
    return data;
  },

  async compteurs(): Promise<CompteursNotifications> {
    const { data } = await apiClient.get<CompteursNotifications>(
      "/notifications/compteurs",
    );
    return data;
  },

  /** 204 sans corps. */
  async marquerLue(id: string): Promise<void> {
    await apiClient.put(`/notifications/${id}/lue`);
  },

  async toutMarquerLu(): Promise<{ marquees: number }> {
    const { data } = await apiClient.put<{ marquees: number }>(
      "/notifications/tout-lire",
    );
    return data;
  },
};