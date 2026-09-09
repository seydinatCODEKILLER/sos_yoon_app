import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useRevokeAllTokens() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: authApi.revokeAllTokens,
    onSuccess: async () => {
      // Le backend vient de révoquer tous les refresh tokens, y compris
      // celui de cette session-ci — on déconnecte immédiatement en local
      // pour éviter un état incohérent (access token encore valide quelques
      // minutes, mais impossible à rafraîchir une fois expiré).
      await logout();
    },
  });
}