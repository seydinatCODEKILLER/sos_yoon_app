import { Outlet, useLocation, useMatches } from "react-router-dom";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AUTH_GUARD_ENABLED } from "@/shared/lib/featureFlags";
import { getNavItems } from "@/config/navigation";
import { getActiveNavPath } from "@/shared/lib/getActiveNavPath";
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
  const matches = useMatches();
  const userRole = useAuthStore((s) => s.user?.role);

  const role = userRole ?? (AUTH_GUARD_ENABLED ? null : roleFromPath(pathname));
  if (!role) return null;

  if (isMobile) {
    return (
      <MobileLayout role={role}>
        <Outlet />
      </MobileLayout>
    );
  }

  const routeTitle = [...matches]
    .reverse()
    .map((m) => (m.handle as { title?: string } | undefined)?.title)
    .find(Boolean);
  const items = getNavItems(role);
  const activePath = getActiveNavPath(items, pathname);
  const title = routeTitle ?? items.find((i) => i.path === activePath)?.label;

  return (
    <DesktopLayout role={role} title={title}>
      <Outlet />
    </DesktopLayout>
  );
}