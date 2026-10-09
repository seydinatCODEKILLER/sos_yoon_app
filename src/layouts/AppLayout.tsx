import { Outlet, useLocation, useMatches } from "react-router-dom";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AssistantFab } from "@/features/assistant/components/AssistantFab";
import { AUTH_GUARD_ENABLED } from "@/shared/lib/featureFlags";
import { getNavItems } from "@/config/navigation";
import { getActiveNavPath } from "@/shared/lib/getActiveNavPath";
import type { UserRole } from "@/types/user.types";
import { DesktopLayout } from "./DesktopLayout";
import { MobileLayout } from "./MobileLayout";

/** Options déclarées par les routes via `handle` */
interface RouteHandle {
  title?: string;
  section?: string;
}

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

  const handles = [...matches].reverse().map((m) => m.handle as RouteHandle | undefined);
  const items = getNavItems(role);
  const activePath = getActiveNavPath(items, pathname);
  const title =
    handles.map((h) => h?.title).find(Boolean) ??
    items.find((i) => i.path === activePath)?.label;
  const section = handles.map((h) => h?.section).find(Boolean);

  return (
    <>
      {isMobile ? (
        <MobileLayout role={role}>
          <Outlet />
        </MobileLayout>
      ) : (
        <DesktopLayout role={role} section={section} title={title}>
          <Outlet />
        </DesktopLayout>
      )}
      {role === "PARTICULIER" && !pathname.startsWith("/app/assistant") && <AssistantFab />}
    </>
  );
}