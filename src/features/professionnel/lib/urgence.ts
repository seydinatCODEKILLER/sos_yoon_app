import type { NiveauUrgence } from "../types/dashboard.types";

export const URGENCE: Record<
  NiveauUrgence,
  { libelle: string; pastille: string; texte: string; barre: string }
> = {
  CRITIQUE: {
    libelle: "Critique",
    pastille: "border-red-200 bg-red-50 text-red-700",
    texte: "text-red-600",
    barre: "bg-signal",
  },
  ELEVE: {
    libelle: "Urgent",
    pastille: "border-amber-200 bg-amber-50 text-amber-700",
    texte: "text-amber-600",
    barre: "bg-amber-400",
  },
  NORMAL: {
    libelle: "Normal",
    pastille: "border-ink/15 bg-ink/5 text-ink/70",
    texte: "text-ink/60",
    barre: "bg-sky-400",
  },
};