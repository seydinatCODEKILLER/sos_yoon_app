import type { ComponentType, SVGProps } from "react";
import {
  Asterisk, Bell, Bot, Briefcase, CalendarDays, Contact, FileText, Folder,
  Home, LayoutDashboard, MessageSquare, Settings, User, Users, Zap,
} from "lucide-react";
import type { UserRole } from "@/types/user.types";

/** Clés des valeurs dynamiques fournies par useNavBadges */
export type NavBadgeKey =
  | "demandes" | "dossiers" | "agenda" | "messages"
  | "notifications" | "professionnelsEnAttente";

export type NavBadge =
  | { kind: "count"; key: NavBadgeKey; tone?: "pill" | "muted"; suffix?: string }
  | { kind: "dot"; key?: NavBadgeKey; color?: "signal" | "success" | "neutral" }
  | { kind: "label"; text: string }; // ex. "IA", fixe

export interface NavItem {
  label: string;
  shortLabel?: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;
  /** true pour l'accueil de l'espace (évite qu'il soit actif sur toutes les sous-routes) */
  end?: boolean;
  badge?: NavBadge;
  /** présent dans la barre du bas sur mobile */
  mobile?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navigationByRole: Record<UserRole, NavSection[]> = {
  PARTICULIER: [
    {
      title: "Navigation",
      items: [
        { label: "Accueil", path: "/app", icon: Home, end: true, mobile: true,
          badge: { kind: "dot", color: "signal" } },
        { label: "Demander de l'aide", shortLabel: "Aide", path: "/app/demandes/nouvelle",
          icon: Asterisk, mobile: true },
        { label: "Mes demandes", shortLabel: "Suivi", path: "/app/demandes",
          icon: FileText, mobile: true, badge: { kind: "count", key: "demandes", tone: "pill" } },
        { label: "Messages", path: "/app/messages", icon: MessageSquare, mobile: true },
        { label: "Assistant juridique", shortLabel: "Assistant", path: "/app/assistant",
          icon: Bot, badge: { kind: "label", text: "IA" } },
        { label: "Notifications", shortLabel: "Alertes", path: "/app/notifications",
          icon: Bell, badge: { kind: "dot", key: "notifications", color: "success" } },
      ],
    },
  ],

  PRO: [
    {
      title: "Menu principal",
      items: [
        { label: "Tableau de bord", shortLabel: "Accueil", path: "/pro", icon: LayoutDashboard,
          end: true, mobile: true, badge: { kind: "dot", color: "neutral" } },
        { label: "Demandes", path: "/pro/demandes", icon: FileText, mobile: true,
          badge: { kind: "count", key: "demandes", tone: "pill" } },
        { label: "Dossiers", path: "/pro/dossiers", icon: Folder,
          badge: { kind: "count", key: "dossiers", tone: "muted" } },
        { label: "Clients", path: "/pro/clients", icon: Contact },
        { label: "Agenda", path: "/pro/agenda", icon: CalendarDays, mobile: true,
          badge: { kind: "count", key: "agenda", tone: "pill", suffix: "auj." } },
        { label: "Messages", path: "/pro/messages", icon: MessageSquare, mobile: true,
          badge: { kind: "count", key: "messages", tone: "pill" } },
        { label: "Notifications", path: "/pro/notifications", icon: Bell,
          badge: { kind: "count", key: "notifications", tone: "pill" } },
      ],
    },
    {
      title: "Paramètres & compte",
      items: [{ label: "Mon profil", path: "/pro/profil", icon: User }],
    },
  ],

  ADMIN: [
    {
      title: "Navigation",
      items: [
        { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true, mobile: true,
          badge: { kind: "dot", color: "signal" } },
        { label: "Utilisateurs", path: "/admin/utilisateurs", icon: Users, mobile: true },
        { label: "Professionnels", shortLabel: "Pros", path: "/admin/professionnels",
          icon: Briefcase, mobile: true,
          badge: { kind: "count", key: "professionnelsEnAttente", tone: "pill" } },
        { label: "Demandes", path: "/admin/demandes", icon: FileText, mobile: true },
        { label: "Moteur IA / Triage", shortLabel: "IA", path: "/admin/moteur-ia", icon: Zap,
          badge: { kind: "dot", color: "neutral" } },
        { label: "Paramètres", path: "/admin/parametres", icon: Settings },
      ],
    },
  ],
};

/** Liste à plat (pour l'ancien code qui attendait un NavItem[]) */
export const getNavItems = (role: UserRole): NavItem[] =>
  navigationByRole[role].flatMap((s) => s.items);

export const getMobileNavItems = (role: UserRole): NavItem[] =>
  getNavItems(role).filter((i) => i.mobile);

/** Page profil, ouverte depuis la carte utilisateur en bas du menu */
export const profilPathByRole: Record<UserRole, string> = {
  PARTICULIER: "/app/profil",
  PRO: "/pro/profil",
  ADMIN: "/admin/parametres",
};

/** Nom du portail affiché dans le fil d'Ariane du header */
export const portalLabelByRole: Record<UserRole, string> = {
  PARTICULIER: "Portail Citoyen",
  PRO: "Espace Professionnel",
  ADMIN: "Administration",
};

/** Page des notifications (pas d'équivalent côté admin) */
export const notificationsPathByRole: Partial<Record<UserRole, string>> = {
  PARTICULIER: "/app/notifications",
  PRO: "/pro/notifications",
};