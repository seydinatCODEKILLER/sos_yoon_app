import type { AppNotification } from "../types/notification.types";

export interface NotificationGroup {
  label: string;
  notifications: AppNotification[];
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function groupNotificationsByDate(
  notifications: AppNotification[],
): NotificationGroup[] {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const groups: Record<string, AppNotification[]> = {
    "Aujourd'hui": [],
    Hier: [],
    "Plus ancien": [],
  };

  for (const notification of notifications) {
    const date = new Date(notification.createdAt);
    if (isSameDay(date, now)) {
      groups["Aujourd'hui"].push(notification);
    } else if (isSameDay(date, yesterday)) {
      groups["Hier"].push(notification);
    } else {
      groups["Plus ancien"].push(notification);
    }
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, notifications: items }));
}