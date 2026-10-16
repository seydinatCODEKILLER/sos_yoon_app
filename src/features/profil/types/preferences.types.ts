export interface PreferencesNotifications {
  /** Alertes sur ce téléphone */
  notificationsPush: boolean;
  /** SMS de secours (pas encore disponible côté API) */
  smsSecours: boolean;
}

export interface ModifierPreferencesPayload {
  notificationsPush: boolean;
}