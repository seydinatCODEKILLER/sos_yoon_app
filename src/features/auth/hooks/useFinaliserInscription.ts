import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import { authErrorMessage } from "../lib/authErrors";
import { authService } from "../service/authService";
import { useAuthStore } from "../store/auth.store";
import type { TokenResponse } from "../types/types";

export function useFinaliserInscription() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Crée le compte sans code secret. Renvoie la session, ou null en cas d'échec */
  async function submit(jetonInscription: string): Promise<TokenResponse | null> {
    setIsSubmitting(true);
    try {
      const session = await authService.particulier.finaliserInscription({
        jetonInscription,
      });
      useAuthStore.getState().setSession(session);
      return session;
    } catch (error) {
      toast.error(authErrorMessage(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}