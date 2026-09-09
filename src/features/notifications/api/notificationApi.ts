import { api } from "@/shared/lib/apiClient";
import type {
  ListNotificationsFilters,
  NotificationsListResponse,
} from "../types/notification.types";

export const notificationApi = {
  listMine: async (
    filters: ListNotificationsFilters = {},
  ): Promise<NotificationsListResponse> => {
    const { data } = await api.get<NotificationsListResponse>(
      "/notifications",
      {
        params: {
          lu: filters.lu,
          page: filters.page,
          limit: filters.limit,
        },
      },
    );
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/lu`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/tout-lire");
  },
};
