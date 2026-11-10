import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/apiClient";

/** GET /referentiels/specialites (spec 6.3) */
export interface Specialite {
  id: string;
  code: string;
  libelle: string;
}

/** Les spécialités bougent très rarement : on les garde pour la session. */
export function useSpecialites() {
  return useQuery({
    queryKey: ["referentiels", "specialites"],
    queryFn: async () => {
      const { data } = await api.get<Specialite[]>("/referentiels/specialites");
      return data;
    },
    staleTime: Infinity,
  });
}