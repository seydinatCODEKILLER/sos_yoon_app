import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notificationApi";

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
