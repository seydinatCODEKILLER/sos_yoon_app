import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { navigationByRole } from "@/config/navigation";
import { DesktopLayout } from "./DesktopLayout";
import { MobileLayout } from "./MobileLayout";

export function AppLayout() {
  const isMobile = useIsMobile();
  const role = useAuthStore((s) => s.user?.role);

  const navItems = role ? (navigationByRole[role] ?? []) : [];

  const Layout = isMobile ? MobileLayout : DesktopLayout;

  return (
    <Layout navItems={navItems}>
      <Outlet />
    </Layout>
  );
}
