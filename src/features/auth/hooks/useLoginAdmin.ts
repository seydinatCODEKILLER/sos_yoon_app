import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { ApiErreur } from "@/types/api.types";
import { getPostLoginRoute } from "@/shared/lib/getPostLoginRoute";
import {
  adminAuthApi,
  mfaEstRequise,
  type LoginAdminPayload,
} from "../api/adminAuthApi";
import { useAuthStore } from "../store/auth.store";

const erreur = (code: string, message: string): ApiErreur => ({
  code,
  message,
  horodatage: new Date().toISOString(),
});

export function useLoginAdmin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (payload: LoginAdminPayload) => {
      const response = await adminAuthApi.connexion(payload);

      // Le serveur n'active pas la double authentification au MVP. Si elle l'est un jour pour ce
      // compte, on ne plante pas sur un TokenResponse absent : on l'explique.
      if (mfaEstRequise(response)) {
        throw erreur(
          "MFA_NON_DISPONIBLE",
          "La double authentification n'est pas encore disponible.",
        );
      }
      if (response.utilisateur.role !== "ADMIN") {
        throw erreur("ACCES_REFUSE", "Accès refusé.");
      }
      return response;
    },
    onSuccess: (response) => {
      setSession(response);
      navigate(getPostLoginRoute(response), { replace: true });
    },
  });
}