import { apiClient } from "@/shared/lib/apiClient";
import type {
  CompteursNotifications,
  FiltreNotifications,
  PageNotifications,
} from "../types/notification.types";

export interface NotificationsApi {
  lister(filtre: FiltreNotifications, page: number, taille: number): Promise<PageNotifications>;
  compteurs(): Promise<CompteursNotifications>;
  marquerLue(id: string): Promise<void>;
  toutLire(): Promise<void>;
}

export const notificationsApi: NotificationsApi = {
  async lister(filtre, page, taille) {
    const { data } = await apiClient.get<PageNotifications>("/notifications", {
      params: { filtre, page, taille },
    });
    return data;
  },

  async compteurs() {
    const { data } = await apiClient.get<CompteursNotifications>("/notifications/compteurs");
    return data;
  },

  async marquerLue(id) {
    await apiClient.put(`/notifications/${id}/lue`);
  },

  async toutLire() {
    await apiClient.put("/notifications/tout-lire");
  },
};