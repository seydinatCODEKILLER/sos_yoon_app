import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { abonnementService } from "../lib/abonnementService";
import type { PayerPayload } from "../types/abonnement.types";

// Même préfixe que useAbonnementPro (carte du tableau de bord) : une invalidation rafraîchit les deux
const ABONNEMENT_KEY = ["pro", "abonnement"] as const;

export function useAbonnementDetail() {
  return useQuery({
    queryKey: [...ABONNEMENT_KEY, "detail"],
    queryFn: () => abonnementService.detail(),
  });
}

export function usePaiements(page = 0, taille = 10) {
  return useQuery({
    queryKey: [...ABONNEMENT_KEY, "paiements", page, taille],
    queryFn: () => abonnementService.paiements(page, taille),
  });
}

export function usePayerAbonnement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PayerPayload) => abonnementService.payer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ABONNEMENT_KEY });
      queryClient.invalidateQueries({ queryKey: ["pro", "dashboard"] });
    },
  });
}