import { useMutation } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { demandesService } from "../service/demandesService";
import { demandeErrorCode, demandeErrorMessage } from "../lib/demandeErrors";
import { useDemandeBrouillon } from "../store/demandeBrouillon.store";
import type { EnvoyerAudioPayload } from "../types/demande.types";

/** Crée (ou réutilise) le brouillon vocal puis envoie l'audio. Renvoie l'id de la demande, ou null en cas d'erreur. */
export function useEnvoyerMessageVocal() {
  const draftId = useDemandeBrouillon((s) => s.draftId);
  const typeSaisie = useDemandeBrouillon((s) => s.typeSaisie);
  const save = useDemandeBrouillon((s) => s.save);
  const reset = useDemandeBrouillon((s) => s.reset);

  const mutation = useMutation({
    mutationFn: async (payload: EnvoyerAudioPayload) => {
      let id = draftId && typeSaisie === "VOCAL" ? draftId : null;
      if (!id) {
        const draft = await demandesService.creer({ typeSaisie: "VOCAL", motsCles: [] });
        save(draft);
        id = draft.id;
      }
      await demandesService.envoyerAudio(id, payload);
      return id;
    },
  });

  const submit = async (payload: EnvoyerAudioPayload): Promise<string | null> => {
    try {
      return await mutation.mutateAsync(payload);
    } catch (error) {
      if (["DEMANDE_NON_MODIFIABLE", "INTROUVABLE"].includes(demandeErrorCode(error))) reset();
      toast.error(demandeErrorMessage(error));
      return null;
    }
  };

  return { submit, isSubmitting: mutation.isPending };
}