import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ModifierPreferencesPayload } from "../types/preferences.types";
import { preferencesService } from "../services/preferencesService";

const KEY = ["profil", "preferences-notifications"] as const;

export function usePreferencesNotifications() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => preferencesService.obtenir(),
  });
}

export function useModifierPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ModifierPreferencesPayload) =>
      preferencesService.modifier(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(KEY, data);
    },
  });
}