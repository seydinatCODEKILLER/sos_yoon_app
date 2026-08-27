import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/auth.store";
import { tokenManager } from "@/shared/lib/tokenManager";

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, accessToken, refreshToken }) => {
      tokenManager.saveTokens(accessToken, refreshToken);
      setUser(user);
    },
  });
}
