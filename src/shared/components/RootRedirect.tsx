import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRouteForSession } from "@/shared/lib/getPostLoginRoute";
import { FullScreenLoader } from "./FullScreenLoader";

export function RootGate() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);
  const portee = useAuthStore((s) => s.portee);

  if (isLoading) return <FullScreenLoader />;

  if (isAuthenticated && user && portee) {
    return <Navigate to={getRouteForSession(user.role, portee)} replace />;
  }

  return <Navigate to="/login" replace />;
}