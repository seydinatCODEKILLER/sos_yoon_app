import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { AppNotification } from "../types/notification.types";
import { getNotificationVisual } from "../lib/notificationIcons";
import { useMarkAsRead } from "../hooks/useMarkAsRead";

interface NotificationItemProps {
  notification: AppNotification;
}

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} j`;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const navigate = useNavigate();
  const markAsRead = useMarkAsRead();
  const { icon: Icon, color } = getNotificationVisual(notification.type);

  const handleClick = () => {
    if (!notification.lu) {
      markAsRead.mutate(notification.id);
    }
    if (notification.demandeId) {
      navigate(`/app/demandes/${notification.demandeId}`);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead.mutate(notification.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={`group flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-paper/60 ${
        !notification.lu ? "bg-signal/5" : ""
      }`}
    >
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper ${color}`}
      >
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`truncate text-sm ${!notification.lu ? "font-medium text-ink" : "text-ink/80"}`}
          >
            {notification.titre}
          </p>
          {!notification.lu && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
            />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground/70">
          {timeAgo(notification.createdAt)}
        </p>
      </div>

      {!notification.lu && (
        <button
          type="button"
          onClick={handleMarkAsRead}
          title="Marquer comme lue"
          className="shrink-0 rounded-full p-1.5 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground hover:bg-white! hover:text-signal!"
        >
          <Check size={13} />
        </button>
      )}
    </div>
  );
}
