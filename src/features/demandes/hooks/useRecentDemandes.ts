import { useQuery } from "@tanstack/react-query";
import { getRecentDemandes } from "../api/mockDemandesApi";

export function useRecentDemandes() {
  return useQuery({
    queryKey: ["demandes", "recentes"],
    queryFn: getRecentDemandes,
  });
}