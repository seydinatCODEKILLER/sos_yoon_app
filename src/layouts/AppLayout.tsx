import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { navigationByRole } from "@/config/navigation";
import { DesktopLayout } from "./DesktopLayout";
import { MobileLayout } from "./MobileLayout";
import { UserTopbarLayout } from "./UserTopbarLayout";

export function AppLayout() {
  const isMobile = useIsMobile();
  const role = useAuthStore((s) => s.user?.role);

  const navItems = role ? (navigationByRole[role] ?? []) : [];

  if (isMobile) {
    return (
      <MobileLayout navItems={navItems}>
        <Outlet />
      </MobileLayout>
    );
  }

  // Desktop : sidebar complète réservée aux rôles avec beaucoup d'items
  // (professionnel, admin) ; topbar légère pour le particulier.
  if (role === "USER") {
    return (
      <UserTopbarLayout navItems={navItems}>
        <Outlet />
      </UserTopbarLayout>
    );
  }

  return (
    <DesktopLayout navItems={navItems}>
      <Outlet />
    </DesktopLayout>
  );
}