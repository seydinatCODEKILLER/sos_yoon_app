import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/auth.store";
import { tokenManager } from "@/shared/lib/tokenManager";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/lib/errorHandler";

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, accessToken, refreshToken }) => {
      tokenManager.saveTokens(accessToken, refreshToken);
      setUser(user);
      toast.success("Connexion réussie", "Vous êtes redirigé vers votre espace.");
    },
    onError: (error) => {
      toast.error("Échec de la connexion", getErrorMessage(error));
    },
  });
}