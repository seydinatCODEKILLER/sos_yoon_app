import type { PreferencesApi } from "../api/preferencesApi";
import type { PreferencesNotifications } from "../types/preferences.types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

let preferences: PreferencesNotifications = {
  notificationsPush: true,
  smsSecours: false,
};

export const mockPreferencesApi: PreferencesApi = {
  async obtenir() {
    await wait(300);
    return preferences;
  },
  async modifier(payload) {
    await wait(500);
    preferences = { ...preferences, notificationsPush: payload.notificationsPush };
    return preferences;
  },
};