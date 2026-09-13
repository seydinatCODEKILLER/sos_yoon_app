import { useState } from "react";
import { toast } from "@/shared/lib/toast";

export function useSubmitVoiceRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(_mediaBlobUrl: string) {
    setIsSubmitting(true);
    try {
      // TODO: brancher sur l'API réelle — envoyer le blob audio en multipart/form-data
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