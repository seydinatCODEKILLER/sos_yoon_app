import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { profilService } from "../services/profilService";
import type { ProfilParticulier } from "../types/profil.types";

/** Les erreurs sont gérées par les composants (message sous le champ ou toast) */
export function useChangerTelephone() {
  const queryClient = useQueryClient();

  const demande = useMutation({
    mutationFn: (nouveauTelephone: string) =>
      profilService.demanderChangementTelephone({ nouveauTelephone }),
  });

  const confirmation = useMutation({
    mutationFn: (code: string) =>
      profilService.confirmerChangementTelephone({ code }),
    onSuccess: (profil) => {
      queryClient.setQueryData<ProfilParticulier>(["profil"], profil);
      // La session garde l'ancien numéro tant qu'on ne la met pas à jour
      useAuthStore.getState().updateUser({
        telephone: profil.telephone,
        telephoneVerifie: profil.telephoneVerifie,
      });
    },
  });

  return {
    demander: demande.mutateAsync,
    confirmer: confirmation.mutateAsync,
    isDemandePending: demande.isPending,
    isConfirmationPending: confirmation.isPending,
  };
}