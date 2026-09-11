import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { RegisterParticulierValues } from "../schema/registerParticulier.schema";

export function useRegisterParticulier() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(values: RegisterParticulierValues) {
    setIsSubmitting(true);
    try {
      // TODO: brancher sur l'API réelle une fois le back-end connectés
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(
        "Code de validation envoyé",
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