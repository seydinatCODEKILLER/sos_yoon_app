import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { LoginProfessionnelValues } from "../schema/loginProfessionnel.schema";
import { authErrorMessage } from "../lib/authErrors";
import { useAuthStore } from "../store/auth.store";
import type { TokenResponse } from "../types/types";
import { authService } from "../service/authService";

export function useLoginProfessionnel() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);

  async function submit(
    values: LoginProfessionnelValues,
  ): Promise<TokenResponse | null> {
    setIsSubmitting(true);
    try {
      const response = await authService.pro.connexion({
        email: values.email,
        motDePasse: values.password, // adaptez si votre champ s'appelle autrement
      });
      setSession(response);
      toast.success("Connexion réussie");
      return response;
    } catch (error) {
      toast.error(authErrorMessage(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}