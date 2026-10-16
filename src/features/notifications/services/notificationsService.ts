import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { mockNotificationsApi } from "../lib/mockNotifications";
import { notificationsApi } from "../api/notificationsApi";

export const notificationsService = USE_MOCK_API
  ? mockNotificationsApi
  : notificationsApi;