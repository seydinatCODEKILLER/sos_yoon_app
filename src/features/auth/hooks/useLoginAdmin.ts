import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { ApiErreur } from "@/types/api.types";
import { useAuthStore } from "../store/auth.store";
import type { LoginAdminPayload } from "../api/adminAuthApi";
import { adminAuthService } from "../service/adminAuthService";
import { getPostLoginRoute } from "@/shared/lib/getPostLoginRoute";

export function useLoginAdmin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (payload: LoginAdminPayload) => {
      const response = await adminAuthService.connexion(payload);
      if (response.utilisateur.role !== "ADMIN") {
        const refus: ApiErreur = {
          code: "ACCES_REFUSE",
          message: "Accès refusé.",
          horodatage: new Date().toISOString(),
        };
        throw refus;
      }
      return response;
    },
    onSuccess: (response) => {
      setSession(response);
      navigate(getPostLoginRoute(response), { replace: true });
    },
  });
}