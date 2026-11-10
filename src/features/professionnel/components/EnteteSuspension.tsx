import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { BrandLogo } from "@/shared/components/BrandLogo";

export function EnteteSuspension() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  function seDeconnecter() {
    logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  }

  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <BrandLogo className="h-5" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={seDeconnecter}
          className="gap-2 text-ink/70 hover:text-ink"
        >
          <LogOut className="size-4" aria-hidden />
          Se déconnecter
        </Button>
      </div>
    </header>
  );
}