import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { RegisterProfessionnelValues } from "../schema/registerProfessionnel.schema";

export function useRegisterProfessionnel() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(values: RegisterProfessionnelValues) {
    setIsSubmitting(true);
    try {
      // TODO: brancher sur l'API réelle (multipart/form-data pour le diplôme)
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(
        "Demande d'inscription envoyée",
        "Notre équipe va vérifier vos informations sous peu."
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