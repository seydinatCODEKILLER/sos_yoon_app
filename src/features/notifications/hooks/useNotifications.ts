import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { notificationApi } from "../api/notificationApi";
import type { ListNotificationsFilters } from "../types/notification.types";

// Pas de socket.io branché pour l'instant (voir README) — un polling
// léger permet de voir apparaître les notifications générées en tâche
// de fond (simulateAnalyseEtMatching) sans devoir rafraîchir la page.
const POLL_INTERVAL_MS = 20000;

export function useNotifications(filters: ListNotificationsFilters = {}) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => notificationApi.listMine(filters),
    placeholderData: keepPreviousData,
    refetchInterval: POLL_INTERVAL_MS,
  });
}
