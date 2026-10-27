import { useQuery } from "@tanstack/react-query";
import { sollicitationsService } from "../lib/sollicitationsService";
import { SOLLICITATIONS_KEY } from "./useSollicitations";

export function useSollicitationDetail(id: string | null) {
  return useQuery({
    queryKey: [...SOLLICITATIONS_KEY, "detail", id],
    queryFn: () => sollicitationsService.detail(id as string),
    enabled: id !== null,
  });
}