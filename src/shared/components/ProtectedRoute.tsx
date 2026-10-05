import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "@/types/user.types";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AUTH_GUARD_ENABLED } from "@/shared/lib/featureFlags";
import { FullScreenLoader } from "./FullScreenLoader";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);

  if (!AUTH_GUARD_ENABLED) {
    return <Outlet />;
  }

if (isLoading) return <FullScreenLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
