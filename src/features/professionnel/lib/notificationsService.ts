import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { notificationsApi, type NotificationsApi } from "../api/notificationsApi";
import { mockNotificationsApi } from "./mockNotifications";

export const notificationsService: NotificationsApi = USE_MOCK_API
  ? mockNotificationsApi
  : notificationsApi;