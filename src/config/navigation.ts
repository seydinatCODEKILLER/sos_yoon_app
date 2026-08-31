import type { ComponentType, SVGProps } from "react";
import { FileText, History, Bell, User } from "lucide-react";
import type { UserRole } from "@/types/user.types";

export interface NavItem {
  label: string;
  shortLabel?: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;
}

export const navigationByRole: Partial<Record<UserRole, NavItem[]>> = {
  USER: [
    {
      label: "Nouvelle demande",
      shortLabel: "Demande",
      path: "/app/demandes/nouvelle",
      icon: FileText,
    },
    {
      label: "Mes demandes",
      shortLabel: "Suivi",
      path: "/app/demandes",
      icon: History,
    },
    {
      label: "Notifications",
      shortLabel: "Alertes",
      path: "/app/notifications",
      icon: Bell,
    },
    {
      label: "Profil",
      path: "/app/profil",
      icon: User,
    },
  ],
};
