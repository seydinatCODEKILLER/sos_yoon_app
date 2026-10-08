import { Outlet, useLocation } from "react-router-dom";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AUTH_GUARD_ENABLED } from "@/shared/lib/featureFlags";
import type { UserRole } from "@/types/user.types";
import { DesktopLayout } from "./DesktopLayout";
import { MobileLayout } from "./MobileLayout";

/** TEMPORAIRE (garde désactivé) : déduit le rôle depuis l'URL */
function roleFromPath(pathname: string): UserRole {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/pro")) return "PRO";
  return "PARTICULIER";
}

export function AppLayout() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const userRole = useAuthStore((s) => s.user?.role);

  const role = userRole ?? (AUTH_GUARD_ENABLED ? null : roleFromPath(pathname));
  if (!role) return null;

  const Layout = isMobile ? MobileLayout : DesktopLayout;
  return (
    <Layout role={role}>
      <Outlet />
    </Layout>
  );
}