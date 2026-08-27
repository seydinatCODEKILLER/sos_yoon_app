import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/auth.store";
import { tokenManager } from "@/shared/lib/tokenManager";

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ user, accessToken, refreshToken }) => {
      tokenManager.saveTokens(accessToken, refreshToken);
      setUser(user);
    },
  });
}
