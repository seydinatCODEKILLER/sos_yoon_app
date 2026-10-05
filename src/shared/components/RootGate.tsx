import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getSpaceRoute } from "@/shared/lib/getSpaceRoute";
import { FullScreenLoader } from "./FullScreenLoader";

export function RootGate() {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getSpaceRoute(user.role)} replace />;
  }

  return <Navigate to="/login" replace />;
}