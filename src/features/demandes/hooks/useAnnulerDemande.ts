import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "@/shared/lib/toast";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { demandeRoutes } from "../lib/demandeRoutes";
import { demandesService } from "../service/demandesService";

export function useAnnulerDemande(id: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => demandesService.annuler(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["demandes"] });
      toast.success("Demande annulée.");
      navigate(demandeRoutes.liste, { replace: true });
    },
    onError: (e) => toast.error(demandeErrorMessage(e)),
  });

  return { annuler: () => mutation.mutate(), isCancelling: mutation.isPending };
}