import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { sollicitationsService } from "../lib/sollicitationsService";
import type { OngletSollicitations } from "../types/sollicitation.types";

export const SOLLICITATIONS_KEY = ["pro", "sollicitations"] as const;
export const TAILLE_PAGE = 12;

export function useSollicitations(onglet: OngletSollicitations, page: number) {
  return useQuery({
    queryKey: [...SOLLICITATIONS_KEY, onglet, page],
    queryFn: () => sollicitationsService.lister(onglet, page, TAILLE_PAGE),
    placeholderData: keepPreviousData,
    // Les demandes expirent et sont réattribuées : on resynchronise
    refetchInterval: onglet === "NOUVELLES" ? 30_000 : false,
  });
}