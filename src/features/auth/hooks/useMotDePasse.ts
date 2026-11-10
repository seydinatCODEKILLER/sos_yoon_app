import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/auth.store";
import type { ReinitialiserMotDePassePayload } from "../types/types";

/** POST /auth/mot-de-passe-oublie : répond toujours 202, que le compte existe ou non */
export function useDemanderLienMotDePasse() {
  return useMutation({
    mutationFn: (email: string) => authApi.motDePasse.oublie({ email }),
  });
}

/** POST /auth/mot-de-passe/reinitialiser : 204, ou 400 JETON_INVALIDE / 410 JETON_EXPIRE */
export function useReinitialiserMotDePasse() {
  return useMutation({
    mutationFn: (payload: ReinitialiserMotDePassePayload) =>
      authApi.motDePasse.reinitialiser(payload),
    onSuccess: () => {
      // Le backend ferme toutes les sessions du compte : on ferme aussi celle de ce navigateur
      const { isAuthenticated, logout } = useAuthStore.getState();
      if (isAuthenticated) void logout();
    },
  });
}