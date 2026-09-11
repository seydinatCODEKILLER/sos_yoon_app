import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getSpaceRoute } from "@/shared/lib/getSpaceRoute";
import { WelcomePage } from "@/features/onboarding/pages/WelcomePage";

export function RootGate() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={getSpaceRoute(user.role)} replace />;
  }

  return <WelcomePage />;
}