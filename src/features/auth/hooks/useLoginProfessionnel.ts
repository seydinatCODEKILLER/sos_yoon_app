import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { LoginProfessionnelValues } from "../schema/loginProfessionnel.schema";

export function useLoginProfessionnel() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(values: LoginProfessionnelValues) {
    setIsSubmitting(true);
    try {
      // TODO: brancher sur l'API réelle une fois le back-end connecté
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Connexion réussie", `Bienvenue, ${values.email}`);
      return true;
    } catch {
      toast.error("Email ou mot de passe incorrect.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}