import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "@/shared/lib/toast";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { demandeRoutes } from "../lib/demandeRoutes";
import { demandesService } from "../service/demandesService";
import type {
  CreerDemandeEcritePayload,
  CreerDemandeVocalePayload,
  DemandeCreee,
} from "../types/demande.types";

export type ResultatEnvoi =
  | { ok: true; demande: DemandeCreee }
  | { ok: false; error: unknown };

/**
 * Envoie une demande (écrite ou vocale) en UNE requête (POST /demandes, spec 8.1),
 * puis ouvre l'écran de suivi. Plus de brouillon côté serveur.
 * Si l'appel échoue, rien n'est créé : on peut renvoyer sans risque de doublon.
 * L'erreur est déjà affichée (toast) ; elle est aussi renvoyée pour que le formulaire
 * puisse marquer le champ fautif.
 */
export function useEnvoyerDemande() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (appel: () => Promise<DemandeCreee>) => appel(),
  });

  async function executer(
    appel: () => Promise<DemandeCreee>,
  ): Promise<ResultatEnvoi> {
    try {
      const demande = await mutation.mutateAsync(appel);
      void queryClient.invalidateQueries({ queryKey: ["demandes"] });
      toast.success(
        "Demande envoyée",
        "Un professionnel va prendre en charge votre demande.",
      );
      navigate(demandeRoutes.suivi(demande.id), { replace: true });
      return { ok: true, demande };
    } catch (error) {
      toast.error(demandeErrorMessage(error));
      return { ok: false, error };
    }
  }

  return {
    envoyer: (payload: CreerDemandeEcritePayload) =>
      executer(() => demandesService.creerEcrite(payload)),
    envoyerVocale: (payload: CreerDemandeVocalePayload) =>
      executer(() => demandesService.creerVocale(payload)),
    isSending: mutation.isPending,
  };
}