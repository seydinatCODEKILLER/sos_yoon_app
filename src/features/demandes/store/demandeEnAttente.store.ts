import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DemandeEcriteValues } from "../schema/demandeEcrite.schema";
import type { LocalisationPayload } from "../types/demande.types";

/** Durée de conservation d'une demande de visiteur : 24 h */
const VALIDITE_MS = 24 * 60 * 60 * 1000;

interface DonneesEcrite {
  type: "ECRITE";
  values: DemandeEcriteValues;
  localisation: LocalisationPayload;
}

interface DonneesVocale {
  type: "VOCALE";
  dureeSecondes: number;
  localisation: LocalisationPayload;
}

export type DonneesDemande = DonneesEcrite | DonneesVocale;
export type DemandeEnAttente = DonneesDemande & { creeLe: number };

interface Etat {
  demande: DemandeEnAttente | null;
  /** true seulement si l'inscription en cours a été lancée depuis cette demande */
  inscriptionPourDemande: boolean;
  garder: (donnees: DonneesDemande) => void;
  marquerInscription: (pourDemande: boolean) => void;
  vider: () => void;
}

type Persiste = Pick<Etat, "demande" | "inscriptionPourDemande">;

export const useDemandeEnAttente = create<Etat>()(
  persist(
    (set) => ({
      demande: null,
      inscriptionPourDemande: false,
      garder: (donnees) =>
        set({
          demande: { ...donnees, creeLe: Date.now() },
          inscriptionPourDemande: false,
        }),
      marquerInscription: (pourDemande) =>
        set((s) => ({ inscriptionPourDemande: pourDemande && s.demande !== null })),
      vider: () => set({ demande: null, inscriptionPourDemande: false }),
    }),
    {
      name: "sos-yoon-demande-en-attente",
      partialize: (s): Persiste => ({
        demande: s.demande,
        inscriptionPourDemande: s.inscriptionPourDemande,
      }),
      merge: (persiste, courant) => {
        const p = persiste as Partial<Persiste> | undefined;
        const valide =
          p?.demande && Date.now() - p.demande.creeLe < VALIDITE_MS
            ? p.demande
            : null;
        return {
          ...courant,
          demande: valide,
          inscriptionPourDemande: valide ? !!p?.inscriptionPourDemande : false,
        };
      },
    },
  ),
);