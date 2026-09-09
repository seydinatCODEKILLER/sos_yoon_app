import { Radar, BellRing } from "lucide-react";
import { getNotificationVisual } from "../lib/notificationIcons";
import type {
  AppNotification,
  NotificationType,
} from "../types/notification.types";

interface NotificationsStatsCardProps {
  notifications: AppNotification[];
  totalNonLues: number;
}

export function NotificationsStatsCard({
  notifications,
  totalNonLues,
}: NotificationsStatsCardProps) {
  const parType = notifications.reduce<Record<NotificationType, number>>(
    (acc, n) => {
      acc[n.type] = (acc[n.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<NotificationType, number>,
  );

  const entries = (
    Object.entries(parType) as [NotificationType, number][]
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center gap-2">
        <BellRing size={14} className="text-signal" />
        <h2 className="text-sm font-semibold text-ink">Aperçu</h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-paper px-3 py-2.5">
          <p className="font-display text-xl text-ink">
            {notifications.length}
          </p>
          <p className="text-[11px] text-muted-foreground">Affichées</p>
        </div>
        <div className="rounded-xl bg-signal/10 px-3 py-2.5">
          <p className="font-display text-xl text-signal">{totalNonLues}</p>
          <p className="text-[11px] text-muted-foreground">Non lues</p>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="mt-4 space-y-2.5 border-t border-border pt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
            Répartition
          </p>
          {entries.map(([type, count]) => {
            const { icon: Icon, color } = getNotificationVisual(type);
            const percent = Math.round((count / notifications.length) * 100);
            return (
              <div key={type} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper ${color}`}
                >
                  <Icon size={12} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-signal/60"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                <span className="w-5 shrink-0 text-right text-xs text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-paper px-3.5 py-3">
        <Radar size={13} className="mt-0.5 shrink-0 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Une notification est envoyée à chaque étape importante de vos
          demandes.
        </p>
      </div>
    </div>
  );
}
