import { useQuery } from "@tanstack/react-query";
import { demandeApi } from "../api/demandeApi";
import type { DemandeStatut } from "../types/demande.types";

// Statuts connus où le matching est encore en cours côté backend.
// ⚠️ À mettre à jour dès que le backend expose les statuts post-matching
// (acceptation/refus par le professionnel, etc.) — sinon le polling
// continuera indéfiniment sur ces nouveaux statuts non reconnus ici.
const STATUTS_EN_COURS: DemandeStatut[] = [
  "ENVOYEE",
  "ANALYSE_EN_COURS",
  "RECHERCHE_PROFESSIONNEL",
  "EN_ATTENTE_ACCEPTATION",
];

export function useDemande(id: string | undefined) {
  return useQuery({
    queryKey: ["demandes", id],
    queryFn: () => demandeApi.getById(id as string),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const statut = query.state.data?.statut;
      if (!statut) return 2000;
      return STATUTS_EN_COURS.includes(statut) ? 2000 : false;
    },
  });
}