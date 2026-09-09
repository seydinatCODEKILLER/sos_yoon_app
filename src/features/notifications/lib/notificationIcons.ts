import {
  CheckCircle2,
  Search,
  UserCheck,
  ThumbsUp,
  RotateCcw,
  Bell,
  type LucideIcon,
} from "lucide-react";
import type { NotificationType } from "../types/notification.types";

interface NotificationVisual {
  icon: LucideIcon;
  color: string;
}

export const NOTIFICATION_VISUALS: Record<
  NotificationType,
  NotificationVisual
> = {
  DEMANDE_CONFIRMATION: { icon: CheckCircle2, color: "text-signal" },
  DEMANDE_ANALYSE_EN_COURS: { icon: Search, color: "text-amber-500" },
  DEMANDE_RECHERCHE_PROFESSIONNEL: { icon: Search, color: "text-amber-500" },
  DEMANDE_PROFESSIONNEL_TROUVE: { icon: UserCheck, color: "text-signal" },
  DEMANDE_ACCEPTEE: { icon: ThumbsUp, color: "text-green-600" },
  DEMANDE_REFUSEE: { icon: RotateCcw, color: "text-amber-500" },
  NOUVELLE_DEMANDE: { icon: Bell, color: "text-signal" },
};

export function getNotificationVisual(
  type: NotificationType,
): NotificationVisual {
  return (
    NOTIFICATION_VISUALS[type] ?? { icon: Bell, color: "text-muted-foreground" }
  );
}
