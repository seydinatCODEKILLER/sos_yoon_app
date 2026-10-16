import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { profilService } from "../services/profilService";
import { redimensionnerEnCarre } from "../lib/redimensionnerImage";
import type { ModifierProfilPayload, ProfilParticulier } from "../types/profil.types";

const CLE = ["profil"] as const;

export function useProfil() {
  return useQuery({
    queryKey: CLE,
    queryFn: () => profilService.obtenir(),
  });
}

export function useChangerPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fichier: File) => {
      const photo = await redimensionnerEnCarre(fichier);
      return profilService.changerPhoto(photo);
    },
    onSuccess: ({ photoUrl }) => {
      queryClient.setQueryData<ProfilParticulier>(CLE, (p) =>
        p ? { ...p, photoUrl } : p,
      );
      toast.success("Photo de profil mise à jour.");
    },
    onError: () => toast.error("Impossible d'envoyer la photo. Réessayez."),
  });
}

export function useSupprimerPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profilService.supprimerPhoto(),
    onSuccess: () => {
      queryClient.setQueryData<ProfilParticulier>(CLE, (p) =>
        p ? { ...p, photoUrl: null } : p,
      );
      toast.success("Photo retirée.");
    },
    onError: () => toast.error("Impossible de retirer la photo."),
  });
}

export function useModifierProfil() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ModifierProfilPayload) =>
      profilService.modifier(payload),
    onSuccess: (profil) => {
      queryClient.setQueryData<ProfilParticulier>(CLE, profil);
    },
  });
}