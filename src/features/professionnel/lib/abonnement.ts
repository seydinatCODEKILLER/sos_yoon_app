import { parseDateServeur } from "@/features/demandes/lib/formatDateDemande";
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

/** Date seule (AAAA-MM-JJ) lue en local ; date et heure sans fuseau lues comme de l'UTC. */
export function formaterDateIso(s: string) {
  const date = s.length === 10 ? new Date(`${s}T00:00:00`) : parseDateServeur(s);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const LIBELLE_MOYEN = { WAVE: "Wave", ORANGE_MONEY: "Orange Money" } as const;

/** Libellé d'un moyen de paiement reçu du serveur, y compris un code inattendu */
export function libelleMoyen(code: string | null) {
  if (!code) return "Paiement";
  return code in LIBELLE_MOYEN ? LIBELLE_MOYEN[code as keyof typeof LIBELLE_MOYEN] : code;
}