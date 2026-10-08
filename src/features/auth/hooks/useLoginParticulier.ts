import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { LoginParticulierValues } from "../schema/loginParticulier.schema";
import { authErrorMessage } from "../lib/authErrors";
import {
  formatInternationalPhone,
  toInternationalPhone,
} from "../lib/phone";
import { authService } from "../service/authService";

export function useLoginParticulier() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(values: LoginParticulierValues) {
    setIsSubmitting(true);
    try {
      const telephone = toInternationalPhone(values.telephone);
      await authService.particulier.demanderCodeConnexion({ telephone });
      toast.success(
        "Code de connexion envoyé",
        `Un code a été envoyé au ${formatInternationalPhone(telephone)}`,
      );
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