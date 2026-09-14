import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getSpaceRoute } from "@/shared/lib/getSpaceRoute";
import { WelcomePage } from "@/features/onboarding/pages/WelcomePage";
import { AUTH_GUARD_ENABLED } from "@/shared/lib/featureFlags";

export function RootGate() {
  const { isAuthenticated, user } = useAuthStore();

  if (!AUTH_GUARD_ENABLED) {
    return <WelcomePage />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getSpaceRoute(user.role)} replace />;
  }

  return <WelcomePage />;
}