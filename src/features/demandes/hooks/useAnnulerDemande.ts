import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "@/shared/lib/toast";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { demandeRoutes } from "../lib/demandeRoutes";
import { demandesService } from "../service/demandesService";
import { suiviQueryKey } from "./useSuiviDemande";

export function useAnnulerDemande(id: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (motif?: string) => demandesService.annuler(id, motif),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["demandes"] });
      toast.success("Demande annulée.");
      navigate(demandeRoutes.liste, { replace: true });
    },
    onError: async (e) => {
      toast.error(demandeErrorMessage(e));
      await queryClient.invalidateQueries({ queryKey: suiviQueryKey(id) });
    },
  });

  return {
    annuler: (motif?: string) => mutation.mutate(motif),
    isCancelling: mutation.isPending,
  };
}