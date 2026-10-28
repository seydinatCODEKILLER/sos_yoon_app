import type { TypeProfession } from "../types/dashboard.types";

/** Ordre d'affichage dans la répartition */
export const ORDRE_METIERS: TypeProfession[] = ["AVOCAT", "HUISSIER", "JURISTE_CONSEIL", "NOTAIRE"];

export const METIERS_ADMIN: Record<
  TypeProfession,
  { libelle: string; pluriel: string; barre: string; piste: string; avatar: string }
> = {
  AVOCAT: {
    libelle: "Avocat",
    pluriel: "Avocats",
    barre: "bg-signal",
    piste: "bg-orange-50",
    avatar: "bg-blue-100 text-blue-700",
  },
  HUISSIER: {
    libelle: "Huissier",
    pluriel: "Huissiers",
    barre: "bg-navy",
    piste: "bg-slate-100",
    avatar: "bg-amber-100 text-amber-700",
  },
  JURISTE_CONSEIL: {
    libelle: "Juriste-conseil",
    pluriel: "Juristes",
    barre: "bg-indigo-400",
    piste: "bg-indigo-50",
    avatar: "bg-violet-100 text-violet-700",
  },
  NOTAIRE: {
    libelle: "Notaire",
    pluriel: "Notaires",
    barre: "bg-emerald-400",
    piste: "bg-emerald-50",
    avatar: "bg-emerald-100 text-emerald-700",
  },
};

/** Destination du bouton « Voir le dossier » : à ajuster quand l'écran Professionnels existera */
export const routeDossierPro = (professionnelId: string) => `/admin/professionnels/${professionnelId}`;