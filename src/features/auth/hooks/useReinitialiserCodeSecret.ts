import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import { authErrorMessage } from "../lib/authErrors";
import { authService } from "../service/authService";

export function useReinitialiserCodeSecret() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(jetonReinitialisation: string, nouveauCodeSecret: string) {
    setIsSubmitting(true);
    try {
      await authService.particulier.reinitialiserCodeSecret({
        jetonReinitialisation,
        nouveauCodeSecret,
      });
      toast.success("Code secret mis à jour", "Connectez-vous avec votre nouveau code.");
      return true;
    } catch (error) {
      toast.error(authErrorMessage(error));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}