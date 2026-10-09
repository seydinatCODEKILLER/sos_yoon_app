import { create } from "zustand";
import type { DemandeDetail, TypeSaisie } from "../types/demande.types";

interface DemandeBrouillonState {
  draftId: string | null;
  typeSaisie: TypeSaisie | null;
  description: string;
  motsCles: string[];
  save: (draft: DemandeDetail) => void;
  reset: () => void;
}

export const useDemandeBrouillon = create<DemandeBrouillonState>((set) => ({
  draftId: null,
  typeSaisie: null,
  description: "",
  motsCles: [],
  save: (draft) =>
    set({
      draftId: draft.id,
      typeSaisie: draft.typeSaisie,
      description: draft.description ?? "",
      motsCles: draft.motsCles,
    }),
  reset: () => set({ draftId: null, typeSaisie: null, description: "", motsCles: [] }),
}));