import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
export function AuthProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, []);

  return <>{children}</>;
}
