import type { ComponentType, SVGProps } from "react";
import {
  FileText,
  History,
  Bell,
  User,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  Users,
  BarChart3,
} from "lucide-react";
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
  PROFESSIONNEL: [
    {
      label: "Demandes reçues",
      shortLabel: "Demandes",
      path: "/pro",
      icon: FileText,
    },
    {
      label: "Disponibilité",
      shortLabel: "Dispo",
      path: "/pro/disponibilite",
      icon: Calendar,
    },
    {
      label: "Messagerie",
      shortLabel: "Messages",
      path: "/pro/messagerie",
      icon: MessageSquare,
    },
    {
      label: "Historique",
      shortLabel: "Historique",
      path: "/pro/historique",
      icon: History,
    },
    { label: "Profil", path: "/pro/profil", icon: User },
  ],

  ADMIN: [
    {
      label: "Dashboard",
      shortLabel: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Professionnels",
      shortLabel: "Pros",
      path: "/admin/professionnels",
      icon: Users,
    },
    {
      label: "Utilisateurs",
      shortLabel: "Users",
      path: "/admin/utilisateurs",
      icon: User,
    },
    {
      label: "Demandes",
      shortLabel: "Demandes",
      path: "/admin/demandes",
      icon: FileText,
    },
    {
      label: "Statistiques",
      shortLabel: "Stats",
      path: "/admin/stats",
      icon: BarChart3,
    },
  ],
};
