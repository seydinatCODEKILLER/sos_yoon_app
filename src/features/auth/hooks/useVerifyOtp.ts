import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { VerifyOtpValues } from "../schema/verifyOtp.schema";

export function useVerifyOtp() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(_values: VerifyOtpValues) {
    setIsSubmitting(true);
    try {
      // TODO: brancher sur l'API réelle une fois le back-end connecté
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Compte vérifié", "Bienvenue sur SOS Yoon !");
      return true;
    } catch {
      toast.error("Code invalide, réessayez.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resend(telephone: string) {
    // TODO: brancher sur l'API réelle
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Code renvoyé", `Un nouveau code a été envoyé au ${telephone}`);
  }

  return { submit, resend, isSubmitting };
}