import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { LoginParticulierValues } from "../schema/loginParticulier.schema";

export function useLoginParticulier() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(values: LoginParticulierValues) {
    setIsSubmitting(true);
    try {
      // TODO: brancher sur l'API réelle une fois le back-end connecté
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(
        "Code de connexion envoyé",
        `Un code a été envoyé au ${values.telephone}`
      );
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