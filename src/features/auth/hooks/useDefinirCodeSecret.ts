import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import { authErrorMessage } from "../lib/authErrors";
import { authService } from "../service/authService";
import { useAuthStore } from "../store/auth.store"; // adaptez le chemin
import type { TokenResponse } from "../types/types";

export function useDefinirCodeSecret() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(jetonInscription: string, codeSecret: string): Promise<TokenResponse | null> {
    setIsSubmitting(true);
    try {
      const session = await authService.particulier.definirCodeSecret({ jetonInscription, codeSecret });
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