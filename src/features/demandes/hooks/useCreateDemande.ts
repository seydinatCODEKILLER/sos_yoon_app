import { useMutation, useQueryClient } from "@tanstack/react-query";
import { demandeApi } from "../api/demandeApi";

export function useCreateDemande() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demandeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demandes", "mine"] });
    },
  });
}