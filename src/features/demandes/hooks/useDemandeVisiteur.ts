import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "@/shared/lib/toast";
import type { DemandeEcriteValues } from "../schema/demandeEcrite.schema";
import type { LocalisationPayload } from "../types/demande.types";
import { useDemandeEnAttente } from "../store/demandeEnAttente.store";
import { sauverAudio } from "../lib/stockageAudio";
import { visiteurRoutes } from "../lib/visiteurRoutes";

export function useDemandeVisiteur() {
  const navigate = useNavigate();
  const estVisiteur = useAuthStore((s) => !s.isAuthenticated);
  const garder = useDemandeEnAttente((s) => s.garder);
  const [isSaving, setIsSaving] = useState(false);

  function garderEcrite(
    values: DemandeEcriteValues,
    localisation: LocalisationPayload,
  ) {
    garder({ type: "ECRITE", values, localisation });
    navigate(visiteurRoutes.inscription);
  }

  async function garderVocale(
    audio: { blob: Blob; dureeSecondes: number },
    localisation: LocalisationPayload,
  ) {
    setIsSaving(true);
    const ok = await sauverAudio(audio.blob);
    setIsSaving(false);

    if (!ok) {
      toast.error(
        "Impossible de conserver votre enregistrement. Réessayez ou écrivez votre message.",
      );
      return;
    }
    garder({ type: "VOCALE", dureeSecondes: audio.dureeSecondes, localisation });
    navigate(visiteurRoutes.inscription);
  }

  return { estVisiteur, garderEcrite, garderVocale, isSaving };
}