import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sollicitationsService } from "../lib/sollicitationsService";
import type { RefusPayload } from "../types/sollicitation.types";
import { DASHBOARD_KEY } from "./useTableauDeBord";
import { SOLLICITATIONS_KEY } from "./useSollicitations";

export function useRefuserSollicitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RefusPayload }) =>
      sollicitationsService.refuser(id, payload),
    // Succès comme échec (déjà expirée) : les listes doivent se rafraîchir
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: SOLLICITATIONS_KEY });
    },
  });
}