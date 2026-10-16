import { useMutation } from "@tanstack/react-query";
import { profilService } from "../services/profilService";
import type { ChangerCodeSecretPayload } from "../types/profil.types";

/** Les erreurs sont gérées par le formulaire (message sous le champ concerné) */
export function useChangerCodeSecret() {
  const mutation = useMutation({
    mutationFn: (payload: ChangerCodeSecretPayload) =>
      profilService.changerCodeSecret(payload),
  });

  return { changer: mutation.mutateAsync, isPending: mutation.isPending };
}