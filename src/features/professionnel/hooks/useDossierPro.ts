import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { authApi } from "../../auth/api/authApi";
import { authErrorMessage } from "../../auth/lib/authErrors";
import type { TypeDocumentPro } from "../../auth/types/types";

export const STATUT_DOSSIER_KEY = ["pro", "inscription", "statut"] as const;

/** État du dossier ; relu toutes les 30 s tant que l'administration ne s'est pas prononcée */
export function useStatutDossierPro() {
  return useQuery({
    queryKey: STATUT_DOSSIER_KEY,
    queryFn: authApi.pro.statutDossier,
    refetchInterval: (q) => (q.state.data?.statut === "EN_ATTENTE" ? 30_000 : false),
    refetchOnWindowFocus: true,
  });
}

/** Renvoie un dossier rejeté (avec la pièce corrigée, s'il y en a une) */
export function useResoumettreDossier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fichiers: Partial<Record<TypeDocumentPro, File>>) =>
      authApi.pro.resoumettre(fichiers),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: STATUT_DOSSIER_KEY });
      toast.success(
        "Dossier renvoyé",
        "Notre équipe va l'examiner à nouveau sous 24 à 48 h ouvrées.",
      );
    },
    onError: (error) => toast.error(authErrorMessage(error)),
  });
}

/** Renvoie l'e-mail de confirmation (répond toujours 202) */
export function useRenvoyerEmailVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.email.renvoyer({ email }),
    onSuccess: () =>
      toast.success("E-mail renvoyé", "Pensez à vérifier vos courriers indésirables."),
    onError: (error) => toast.error(authErrorMessage(error)),
  });
}