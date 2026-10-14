import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/shared/lib/toast";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { useDemandeBrouillon } from "../store/demandeBrouillon.store";
import type { LocalisationPayload } from "../types/demande.types";
import { demandesService } from "../service/demandesService";
import { demandeRoutes } from "../lib/demandeRoutes";

export function useEnvoyerDemande() {
  const navigate = useNavigate();
  const reset = useDemandeBrouillon((s) => s.reset);
  const [isSending, setIsSending] = useState(false);

  async function envoyer(id: string, localisation: LocalisationPayload): Promise<boolean> {
    setIsSending(true);
    try {
      await demandesService.definirLocalisation(id, localisation);
      await demandesService.envoyer(id);
      reset();
      toast.success("Demande envoyée", "Un professionnel va prendre en charge votre demande.");
      navigate(demandeRoutes.suivi(id), { replace: true });
      return true;
    } catch (error) {
      toast.error(demandeErrorMessage(error));
      return false;
    } finally {
      setIsSending(false);
    }
  }

  return { envoyer, isSending };
}