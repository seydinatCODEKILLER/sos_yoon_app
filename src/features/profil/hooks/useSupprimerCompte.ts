import { useMutation } from "@tanstack/react-query";
import { compteService } from "../services/compteService";
import type { SupprimerComptePayload } from "../types/profil.types";

export function useSupprimerCompte() {
  return useMutation({
    mutationFn: (payload: SupprimerComptePayload) =>
      compteService.supprimer(payload),
  });
}