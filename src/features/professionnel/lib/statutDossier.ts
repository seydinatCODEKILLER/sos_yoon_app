import type { StatutDossier } from "../types/dossier.types";

export const STATUT_DOSSIER: Record<
  StatutDossier,
  { libelle: string; classe: string; point: string }
> = {
  EN_COURS: { libelle: "En cours", classe: "bg-amber-100 text-amber-800", point: "bg-amber-500" },
  EN_ATTENTE_CLIENT: {
    libelle: "En attente client",
    classe: "bg-sky-100 text-sky-700",
    point: "bg-sky-500",
  },
  CLOTURE: { libelle: "Clôturé", classe: "bg-emerald-100 text-emerald-700", point: "bg-emerald-500" },
};