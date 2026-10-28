import type {
  ProfessionnelAdmin,
  StatutAffichagePro,
  StatutCompteProfessionnel,
  StatutDossier,
  TypeDocument,
  TypeProfession,
} from "../types/professionnels.types";

export const METIERS_PRO: Record<TypeProfession, { libelle: string; pastille: string }> = {
  AVOCAT: { libelle: "Avocat", pastille: "bg-navy" },
  HUISSIER: { libelle: "Huissier de justice", pastille: "bg-blue-600" },
  NOTAIRE: { libelle: "Notaire", pastille: "bg-amber-700" },
  JURISTE_CONSEIL: { libelle: "Juriste-conseil", pastille: "bg-signal" },
};

export const LIBELLE_DOCUMENT: Record<TypeDocument, string> = {
  CARTE_PRO: "Carte professionnelle",
  DIPLOME: "Diplôme",
  PIECE_IDENTITE: "Pièce d'identité",
};

export function statutAffichage(p: {
  statutCompte: StatutCompteProfessionnel;
  statutDossier: StatutDossier;
}): StatutAffichagePro {
  if (p.statutCompte === "SUSPENDU_ADMIN") return "SUSPENDU";
  if (p.statutDossier === "REJETE") return "REFUSE";
  if (p.statutDossier === "EN_ATTENTE") return "EN_ATTENTE";
  return "VALIDE";
}

export const statutDeLigne = (p: ProfessionnelAdmin) => statutAffichage(p);

export const LIBELLE_STATUT: Record<StatutAffichagePro, string> = {
  VALIDE: "Validé",
  EN_ATTENTE: "En attente",
  SUSPENDU: "Suspendu",
  REFUSE: "Refusé",
};

export const COULEUR_STATUT: Record<StatutAffichagePro, string> = {
  VALIDE: "bg-emerald-500",
  EN_ATTENTE: "bg-signal",
  SUSPENDU: "bg-rose-500",
  REFUSE: "bg-muted-foreground/60",
};

export const TEXTE_STATUT: Record<StatutAffichagePro, string> = {
  VALIDE: "text-foreground",
  EN_ATTENTE: "text-signal",
  SUSPENDU: "text-rose-600",
  REFUSE: "text-muted-foreground",
};

export function formaterTaille(octets: number): string {
  return octets >= 1_000_000
    ? `${(octets / 1_000_000).toFixed(1).replace(".", ",")} Mo`
    : `${Math.max(1, Math.round(octets / 1000))} Ko`;
}

export function formaterDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}