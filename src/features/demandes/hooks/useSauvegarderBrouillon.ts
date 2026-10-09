import { useMutation } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import type { DemandeDetail } from "../types/demande.types";
import { demandesService } from "../service/demandesService";
import { demandeErrorCode, demandeErrorMessage } from "../lib/demandeErrors";
import type { DemandeEcriteValues } from "../schema/demandeEcrite.schema";
import { useDemandeBrouillon } from "../store/demandeBrouillon.store";

/** Crée le brouillon, ou le met à jour s'il existe déjà. Renvoie null en cas d'erreur (déjà affichée). */
export function useSauvegarderBrouillon() {
  const draftId = useDemandeBrouillon((s) => s.draftId);
  const save = useDemandeBrouillon((s) => s.save);
  const reset = useDemandeBrouillon((s) => s.reset);
  const typeSaisie = useDemandeBrouillon((s) => s.typeSaisie);

const mutation = useMutation({
  mutationFn: (values: DemandeEcriteValues) =>
    draftId && typeSaisie === "TEXTE"
      ? demandesService.modifier(draftId, values)
      : demandesService.creer({ typeSaisie: "TEXTE", ...values }),
});

  const submit = async (
    values: DemandeEcriteValues,
  ): Promise<DemandeDetail | null> => {
    try {
      const draft = await mutation.mutateAsync(values);
      save(draft);
      return draft;
    } catch (error) {
      // Brouillon déjà envoyé ou disparu : on repart d'une demande vierge
      if (
        ["DEMANDE_NON_MODIFIABLE", "INTROUVABLE"].includes(
          demandeErrorCode(error),
        )
      )
        reset();
      toast.error(demandeErrorMessage(error));
      return null;
    }
  };

  return { submit, isSubmitting: mutation.isPending };
}
