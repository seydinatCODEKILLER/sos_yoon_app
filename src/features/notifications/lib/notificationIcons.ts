import {
  CheckCircle2,
  Search,
  UserCheck,
  XCircle,
  Bell,
  type LucideIcon,
} from "lucide-react";
import type { NotificationType } from "@/features/notifications/types/notification.types";

export const NOTIFICATION_ICONS: Record<
  NotificationType,
  { icon: LucideIcon; accent: "ink" | "brass" | "signal" | "red" }
> = {
  DEMANDE_CONFIRMATION: { icon: CheckCircle2, accent: "signal" },
  DEMANDE_ANALYSE_EN_COURS: { icon: Search, accent: "brass" },
  DEMANDE_RECHERCHE_PROFESSIONNEL: { icon: Search, accent: "signal" },
  DEMANDE_PROFESSIONNEL_TROUVE: { icon: UserCheck, accent: "signal" },
  DEMANDE_ACCEPTEE: { icon: CheckCircle2, accent: "signal" },
  DEMANDE_REFUSEE: { icon: XCircle, accent: "red" },
  NOUVELLE_DEMANDE: { icon: Bell, accent: "ink" },
};