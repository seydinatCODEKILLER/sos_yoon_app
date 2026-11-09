import { apiClient } from "@/shared/lib/apiClient";
import type {
  ModifierPreferencesPayload,
  PreferencesNotifications,
} from "../types/preferences.types";

export interface PreferencesApi {
  obtenir(): Promise<PreferencesNotifications>;
  modifier(payload: ModifierPreferencesPayload): Promise<PreferencesNotifications>;
}

export const preferencesApi: PreferencesApi = {
  async obtenir() {
    const { data } = await apiClient.get<PreferencesNotifications>(
      "/particulier/preferences-notifications",
    );
    return data;
  },
  async modifier(payload) {
    const { data } = await apiClient.put<PreferencesNotifications>(
      "/particulier/preferences-notifications",
      payload,
    );
    return data;
  },
};