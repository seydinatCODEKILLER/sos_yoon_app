import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import { detailValue, toApiErreur } from "@/shared/lib/apiError";
import type { VerifyOtpValues } from "../schema/verifyOtp.schema";
import { authErrorMessage } from "../lib/authErrors";
import { authService } from "../service/authService";
import type { TypeCode } from "../types/types";

export function useVerifyOtp(telephone: string, type: TypeCode) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Renvoie le jeton (inscription ou réinitialisation), ou null en cas d'échec */
  async function submit({ code }: VerifyOtpValues): Promise<string | null> {
    setIsSubmitting(true);
    try {
      if (type === "INSCRIPTION") {
        const res = await authService.particulier.verifierCodeInscription({ telephone, code });
        return res.jetonInscription;
      }
      const res = await authService.particulier.verifierCodeReinitialisation({ telephone, code });
      return res.jetonReinitialisation;
    } catch (error) {
      toast.error(authErrorMessage(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Renvoie le délai (en secondes) avant le prochain renvoi, ou null en cas d'échec.
   * Si le serveur répond « trop tôt » (429 RENVOI_TROP_TOT), on renvoie le temps
   * qui reste à attendre : le compte à rebours se recale sur le serveur.
   */
  async function resend(): Promise<number | null> {
    try {
      const res = await authService.particulier.renvoyerCode({ telephone, type });
      toast.success("Nouveau code envoyé");
      return res.delaiRenvoiSecondes;
    } catch (error) {
      const e = toApiErreur(error);
      toast.error(authErrorMessage(error));
      if (e.code === "RENVOI_TROP_TOT") {
        const secondes = Number(detailValue(e, "retryAfterSeconds"));
        if (Number.isFinite(secondes) && secondes > 0) return secondes;
      }
      return null;
    }
  }

  return { submit, resend, isSubmitting };
}