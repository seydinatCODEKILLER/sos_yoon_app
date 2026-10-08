import type { CSSProperties } from "react";
import type { UserRole } from "@/types/user.types";

const theme = (vars: Record<string, string>) => vars as CSSProperties;

export const sidebarThemes: Record<UserRole, CSSProperties> = {
  PARTICULIER: theme({
    "--sidebar": "#171630",
    "--sidebar-foreground": "#ffffff",
    "--sidebar-accent": "rgba(255,255,255,0.07)",
    "--sidebar-border": "rgba(255,255,255,0.08)",
    "--nav-brand": "#ffffff",
    "--nav-title": "rgba(255,255,255,0.4)",
    "--nav-muted": "rgba(255,255,255,0.65)",
    "--nav-active-bg": "#f9610d",
    "--nav-active-fg": "#ffffff",
    "--nav-badge-bg": "rgba(255,255,255,0.9)",
    "--nav-badge-fg": "#171630",
    "--nav-card-bg": "rgba(255,255,255,0.07)",
    "--nav-card-fg": "#ffffff",
  }),
  PRO: theme({
    "--sidebar": "#0f1527",
    "--sidebar-foreground": "#ffffff",
    "--sidebar-accent": "rgba(255,255,255,0.06)",
    "--sidebar-border": "rgba(255,255,255,0.08)",
    "--nav-brand": "#ffffff",
    "--nav-title": "rgba(255,255,255,0.4)",
    "--nav-muted": "rgba(255,255,255,0.65)",
    "--nav-active-bg": "#f4efe6",
    "--nav-active-fg": "#0f1527",
    "--nav-badge-bg": "#f4efe6",
    "--nav-badge-fg": "#0f1527",
    "--nav-card-bg": "#f4efe6",
    "--nav-card-fg": "#0f1527",
  }),
  ADMIN: theme({
    "--sidebar": "#ffffff",
    "--sidebar-foreground": "#171630",
    "--sidebar-accent": "#f3f3f6",
    "--sidebar-border": "#ececf0",
    "--nav-brand": "#f9610d",
    "--nav-title": "rgba(23,22,48,0.4)",
    "--nav-muted": "rgba(23,22,48,0.62)",
    "--nav-active-bg": "#f1f1f5",
    "--nav-active-fg": "#171630",
    "--nav-badge-bg": "rgba(249,97,13,0.12)",
    "--nav-badge-fg": "#f9610d",
    "--nav-card-bg": "transparent",
    "--nav-card-fg": "#171630",
  }),
};