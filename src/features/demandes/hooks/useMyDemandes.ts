import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { demandeApi } from "../api/demandeApi";
import type { ListDemandesFilters } from "../types/demande.types";

export function useMyDemandes(filters: ListDemandesFilters = {}) {
  return useQuery({
    queryKey: ["demandes", "mine", filters],
    queryFn: () => demandeApi.listMine(filters),
    placeholderData: keepPreviousData,
  });
}