import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { FullScreenLoader } from "@/shared/components/FullScreenLoader";
import { VisiteurHeader } from "./VisiteurHeader";

export function VisiteurLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <FullScreenLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-dvh">
      <VisiteurHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}