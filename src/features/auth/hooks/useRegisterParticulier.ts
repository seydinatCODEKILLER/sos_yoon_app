import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { RegisterParticulierValues } from "../schema/registerParticulier.schema";
import { authErrorMessage } from "../lib/authErrors";
import { CGU_VERSION } from "../lib/legal";
import {
  formatInternationalPhone,
  toInternationalPhone,
} from "../lib/phone";
import { authService } from "../service/authService";

export function useRegisterParticulier() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(values: RegisterParticulierValues) {
    setIsSubmitting(true);
    try {
      const telephone = toInternationalPhone(values.telephone);
      await authService.particulier.demanderCodeInscription({
        telephone,
        cguAcceptees: true, // acceptation par « En continuant » (maquette)
        versionCgu: CGU_VERSION,
      });
      toast.success(
        "Code de validation envoyé",
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