import { useMutation } from "@tanstack/react-query";
import type { ReinitialisationPayload } from "../api/motDePasseApi";
import { motDePasseService } from "../service/motDePasseService";

export function useDemanderLienMotDePasse() {
  return useMutation({
    mutationFn: (email: string) => motDePasseService.demanderLien(email),
  });
}

export function useReinitialiserMotDePasse() {
  return useMutation({
    mutationFn: (payload: ReinitialisationPayload) => motDePasseService.reinitialiser(payload),
  });
}