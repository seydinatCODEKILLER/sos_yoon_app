import type { TypeProfession } from "../types/profil.types";

/**
 * Tarifs du MVP. Source de vérité = backend (montantMensuel).
 * Servent à la grille des tarifs et au mock.
 */
export const MONTANT_PAR_PROFESSION: Record<TypeProfession, number> = {
  AVOCAT: 30_000,
  HUISSIER: 30_000,
  NOTAIRE: 30_000,
  JURISTE_CONSEIL: 20_000,
};

export const montantPourProfession = (t: TypeProfession) => MONTANT_PAR_PROFESSION[t];

export const PLANS: { libelle: string; metiers: TypeProfession[]; montant: number }[] = [
  { libelle: "Avocat, huissier, notaire", metiers: ["AVOCAT", "HUISSIER", "NOTAIRE"], montant: 30_000 },
  { libelle: "Juriste-conseil", metiers: ["JURISTE_CONSEIL"], montant: 20_000 },
];

export const formaterFcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;

/** Accepte AAAA-MM-JJ ou une date ISO complète */
export function formaterDateIso(s: string) {
  return new Date(s.length === 10 ? `${s}T00:00:00` : s).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const LIBELLE_MOYEN = { WAVE: "Wave", ORANGE_MONEY: "Orange Money" } as const;