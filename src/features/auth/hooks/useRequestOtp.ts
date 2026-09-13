import { useState } from "react";
import { toast } from "@/shared/lib/toast";

export function useRequestOtp() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(telephone: string) {
    setIsSubmitting(true);
    try {
      // TODO: brancher sur l'API réelle — un seul endpoint, peu importe
      // que le numéro corresponde à un compte existant ou nouveau
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Code envoyé", `Un code a été envoyé au ${telephone}`);
      return true;
    } catch {
      toast.error("Une erreur est survenue, réessayez.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}