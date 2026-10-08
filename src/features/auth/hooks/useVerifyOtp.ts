import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { VerifyOtpValues } from "../schema/verifyOtp.schema";
import { authErrorMessage } from "../lib/authErrors";
import { formatInternationalPhone } from "../lib/phone";
import { useAuthStore } from "../store/auth.store";
import { authService } from "../service/authService";
import type { TokenResponse, TypeCode } from "../types/types";

export function useVerifyOtp(telephone: string, type: TypeCode) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);

  async function submit({ code }: VerifyOtpValues): Promise<TokenResponse | null> {
    setIsSubmitting(true);
    try {
      const verify =
        type === "INSCRIPTION"
          ? authService.particulier.verifierCodeInscription
          : authService.particulier.verifierCodeConnexion;
      const response = await verify({ telephone, code });
      setSession(response);
      toast.success("Compte vérifié", "Bienvenue sur SOS Yoon !");
      return response;
    } catch (error) {
      toast.error(authErrorMessage(error)); // OTP_INVALIDE, OTP_EXPIRE, OTP_BLOQUE…
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  /** Renvoie le délai avant le prochain renvoi (secondes), ou null en cas d'échec. */
  async function resend(): Promise<number | null> {
    try {
      const { delaiRenvoiSecondes } = await authService.particulier.renvoyerCode({
        telephone,
        type,
      });
      toast.success(
        "Code renvoyé",
        `Un nouveau code a été envoyé au ${formatInternationalPhone(telephone)}`,
      );
      return delaiRenvoiSecondes;
    } catch (error) {
      toast.error(authErrorMessage(error)); // RENVOI_TROP_TOT…
      return null;
    }
  }

  return { submit, resend, isSubmitting };
}