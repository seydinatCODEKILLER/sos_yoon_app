import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { profilService } from "../services/profilService";
import { redimensionnerEnCarre } from "../lib/redimensionnerImage";
import type { ModifierProfilPayload, ProfilParticulier } from "../types/profil.types";

const CLE = ["profil"] as const;

/** Garde la session (nom affiché ailleurs, bande « Complétez votre profil »…) alignée sur le profil */
function synchroniserSession(p: ProfilParticulier) {
  useAuthStore.getState().updateUser({
    prenom: p.prenom,
    nom: p.nom,
    email: p.email,
    photoUrl: p.photoUrl,
    profilComplete: p.profilComplete,
  });
}

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
      useAuthStore.getState().updateUser({ photoUrl });
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
      useAuthStore.getState().updateUser({ photoUrl: null });
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
      synchroniserSession(profil);
    },
  });
}