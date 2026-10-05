import { useQuery } from "@tanstack/react-query";
import { getRecentNotifications } from "../api/mockNotificationsApi";

export function useRecentNotifications() {
  return useQuery({
    queryKey: ["notifications", "recentes"],
    queryFn: getRecentNotifications,
  });
}