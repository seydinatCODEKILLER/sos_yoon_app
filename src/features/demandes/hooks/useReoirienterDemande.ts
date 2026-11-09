import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { demandesService } from "../service/demandesService";
import { suiviQueryKey } from "./useSuiviDemande";

/** « Changer de professionnel » : la demande passe au suivant dans la file de réserve (spec 8.7) */
export function useReorienterDemande(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => demandesService.reorienter(id),
    onSuccess: (suivi) => {
      // La réponse a le même format que le suivi : on met l'écran à jour tout de suite
      queryClient.setQueryData(suiviQueryKey(id), suivi);
      toast.success("Votre demande a été transmise au professionnel suivant.");
    },
    onError: async (e) => {
      toast.error(demandeErrorMessage(e));
      // 409 AUCUN_PROFESSIONNEL_SUIVANT : le serveur a déjà basculé la demande vers l'équipe SOS Yoon
      await queryClient.invalidateQueries({ queryKey: suiviQueryKey(id) });
    },
  });

  return {
    reorienter: () => mutation.mutate(),
    isReorienting: mutation.isPending,
  };
}