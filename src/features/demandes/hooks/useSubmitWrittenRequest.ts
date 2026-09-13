import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { Metier } from "@/types/user.types";

type SubmitWrittenRequestPayload = {
  message: string;
  metier: Metier;
  position: { latitude: number; longitude: number };
};

export function useSubmitWrittenRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(_payload: SubmitWrittenRequestPayload) {
    setIsSubmitting(true);
    try {
      // TODO: brancher sur l'API réelle une fois le back-end connecté
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(
        "Demande envoyée",
        "Nous recherchons le professionnel le plus proche."
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