import { Navigate, Outlet } from "react-router-dom";
import type { Portee, UserRole } from "@/types/user.types";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AUTH_GUARD_ENABLED } from "@/shared/lib/featureFlags";
import { getRouteForSession } from "@/shared/lib/getPostLoginRoute";
import { FullScreenLoader } from "./FullScreenLoader";

interface ProtectedRouteProps {
  /** Rôles autorisés. Absent = tous les rôles. */
  allowedRoles?: UserRole[];
  /** Portée exigée pour cette zone. Par défaut : accès complet. */
  requiredPortee?: Portee;
}

export function ProtectedRoute({
  allowedRoles,
  requiredPortee = "COMPLET",
}: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);
  const portee = useAuthStore((s) => s.portee);

  if (!AUTH_GUARD_ENABLED) return <Outlet />;

  if (isLoading) return <FullScreenLoader />;

  if (!isAuthenticated || !user || !portee) {
    return <Navigate to="/login" replace />;
  }

  // Mauvais rôle : on le renvoie vers la racine, RootGate le dirigera chez lui
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Bon rôle mais mauvaise portée (ex. dossier en attente, impayé…)
  if (portee !== requiredPortee) {
    return <Navigate to={getRouteForSession(user.role, portee)} replace />;
  }

  return <Outlet />;
}