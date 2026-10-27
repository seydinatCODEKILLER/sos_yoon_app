import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../lib/notificationsService";
import { TAILLE_NOTIFICATIONS } from "../lib/notifications";
import type { FiltreNotifications } from "../types/notification.types";

export const NOTIFICATIONS_KEY = ["pro", "notifications"] as const;

export function useNotifications(filtre: FiltreNotifications, page: number) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, "liste", filtre, page],
    queryFn: () => notificationsService.lister(filtre, page, TAILLE_NOTIFICATIONS),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  });
}

export function useCompteursNotifications(actif = true) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, "compteurs"],
    queryFn: () => notificationsService.compteurs(),
    enabled: actif,
    refetchInterval: 60_000,
  });
}

export function useMarquerNotificationLue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.marquerLue(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useToutMarquerLu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.toutLire(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}