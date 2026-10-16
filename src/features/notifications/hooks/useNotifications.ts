import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { notificationsService } from "../services/notificationsService";

const CLE = ["notifications"] as const;
const POLL_MS = 30000;

export function useNotifications() {
  return useQuery({
    queryKey: CLE,
    queryFn: () => notificationsService.lister(),
    refetchInterval: POLL_MS,
  });
}

export function useMarquerLue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.marquerLue(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLE }),
  });
}

export function useToutMarquerLu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.toutMarquerLu(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLE }),
    onError: () => toast.error("Impossible de marquer les notifications comme lues."),
  });
}