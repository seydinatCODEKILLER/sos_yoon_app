// Seuls CABINET et AVOCAT/JURISTE_CONSEIL sont cités dans le doc : les autres codes sont supposés
const PRESTATIONS: Record<string, string> = {
  CABINET: "En cabinet",
  VISIO: "En visio",
  DOMICILE: "À domicile",
};

const METIERS: Record<string, string> = {
  AVOCAT: "Avocat",
  NOTAIRE: "Notaire",
  HUISSIER: "Huissier de justice",
  JURISTE_CONSEIL: "Juriste-conseil",
};

export const libellePrestation = (code: string) =>
  PRESTATIONS[code] ?? code.toLowerCase().replace(/_/g, " ");

export const libelleMetier = (code: string) =>
  METIERS[code] ?? code.toLowerCase().replace(/_/g, " ");