import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getSpaceRoute } from "@/shared/lib/getSpaceRoute";

export function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={getSpaceRoute(user.role)} replace />;
  }

  return <Navigate to="/login" replace />;
}
