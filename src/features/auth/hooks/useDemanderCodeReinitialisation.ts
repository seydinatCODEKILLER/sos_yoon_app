import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { CodeOublieValues } from "../schema/codeOublie.schema";
import { authErrorMessage } from "../lib/authErrors";
import { toInternationalPhone } from "../lib/phone";
import { authService } from "../service/authService";

export function useDemanderCodeReinitialisation() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Renvoie le numéro au format international, ou null en cas d'échec */
  async function submit(values: CodeOublieValues): Promise<string | null> {
    setIsSubmitting(true);
    try {
      const telephone = toInternationalPhone(values.telephone);
      await authService.particulier.demanderCodeReinitialisation({ telephone });
      toast.success("Demande envoyée", "Si un compte existe, un code vous a été envoyé par SMS.");
      return telephone;
    } catch (error) {
      toast.error(authErrorMessage(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}