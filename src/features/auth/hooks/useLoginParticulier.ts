import { useState } from "react";
import { useAuthStore } from "../store/auth.store"; // adaptez le chemin
import type { LoginParticulierValues } from "../schema/loginParticulier.schema";
import { connexionParticulierMessage } from "../lib/connexionErrors";
import { toInternationalPhone } from "../lib/phone";
import { authService } from "../service/authService";

export function useLoginParticulier() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function submit(values: LoginParticulierValues) {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const session = await authService.particulier.connexion({
        telephone: toInternationalPhone(values.telephone),
        codeSecret: values.codeSecret,
      });
      useAuthStore.getState().setSession(session);
      return session;
    } catch (error) {
      setServerError(connexionParticulierMessage(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, serverError, clearError: () => setServerError(null) };
}