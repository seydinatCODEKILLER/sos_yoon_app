import { apiClient } from "@/shared/lib/apiClient";
import type { Notification } from "../types/notification.types";

export interface NotificationsApi {
  lister(): Promise<Notification[]>;
  marquerLue(id: string): Promise<void>;
  toutMarquerLu(): Promise<void>;
}

export const notificationsApi: NotificationsApi = {
  async lister() {
    const { data } = await apiClient.get<Notification[]>("/notifications");
    return data;
  },

  async marquerLue(id) {
    await apiClient.post(`/notifications/${id}/lue`);
  },

  async toutMarquerLu() {
    await apiClient.post("/notifications/tout-lire");
  },
};