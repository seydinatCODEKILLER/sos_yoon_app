import type { ComponentType } from "react";
import { FileText, History, Bell, User } from "lucide-react";
import type { UserRole } from "@/types/user.types";

export interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
}

export const navigationByRole: Partial<Record<UserRole, NavItem[]>> = {
  USER: [
    {
      label: "Nouvelle demande",
      path: "/app/demandes/nouvelle",
      icon: FileText,
    },
    { label: "Mes demandes", path: "/app/demandes", icon: History },
    { label: "Notifications", path: "/app/notifications", icon: Bell },
    { label: "Profil", path: "/app/profil", icon: User },
  ],
};
