import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { demandesService } from "../service/demandesService";

export function useElargirRecherche(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => demandesService.elargir(id),
    // Le suivi est rechargé : l'étape repasse à « en cours », ce qui relance le polling
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["demandes", "suivi", id],
      });
      toast.success("Recherche élargie aux secteurs voisins.");
    },
    onError: (e) => toast.error(demandeErrorMessage(e)),
  });

  return {
    elargir: () => mutation.mutate(),
    isElargissing: mutation.isPending,
  };
}