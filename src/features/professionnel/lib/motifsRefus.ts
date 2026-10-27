export const MOTIFS_REFUS_CODES = [
  "HORS_COMPETENCE",
  "INDISPONIBILITE",
  "CONFLIT_INTERETS",
  "DELAI_INCOMPATIBLE",
  "AUTRE",
] as const;

export type MotifRefus = (typeof MOTIFS_REFUS_CODES)[number];

// Même liste que GET /referentiels/motifs-refus (codes fixes dans le doc)
export const MOTIFS_REFUS: { code: MotifRefus; libelle: string }[] = [
  { code: "HORS_COMPETENCE", libelle: "Hors champ de compétence / spécialité" },
  { code: "INDISPONIBILITE", libelle: "Indisponibilité d'agenda / surcharge actuelle" },
  { code: "CONFLIT_INTERETS", libelle: "Conflit d'intérêts potentiel" },
  { code: "DELAI_INCOMPATIBLE", libelle: "Dossier urgent non compatible avec mes délais" },
  { code: "AUTRE", libelle: "Autre motif" },
];

/** Motif présélectionné et marqué « Recommandé » (choix côté front, à retirer si inutile) */
export const MOTIF_RECOMMANDE: MotifRefus = "HORS_COMPETENCE";