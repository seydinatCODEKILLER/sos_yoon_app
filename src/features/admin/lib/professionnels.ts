import type {
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

/**
 * État affiché d'un professionnel. La suspension prime, puis le dossier d'inscription.
 * Un dossier absent ou resté en brouillon n'a jamais été soumis : ce n'est pas un compte validé.
 */
export function statutAffichage(p: {
  statutCompte: StatutCompteProfessionnel;
  statutDossier: StatutDossier | null;
}): StatutAffichagePro {
  if (p.statutCompte === "SUSPENDU_ADMIN") return "SUSPENDU";
  switch (p.statutDossier) {
    case "REJETE":
      return "REFUSE";
    case "EN_ATTENTE":
      return "EN_ATTENTE";
    case "APPROUVE":
      return "VALIDE";
    case "BROUILLON":
      return "INCOMPLET";
    default:
      // Aucun dossier : seul un compte déjà actif (ancien compte) peut être considéré comme validé.
      return p.statutCompte === "ACTIF" ? "VALIDE" : "INCOMPLET";
  }
}

export const LIBELLE_STATUT: Record<StatutAffichagePro, string> = {
  VALIDE: "Validé",
  EN_ATTENTE: "À instruire",
  SUSPENDU: "Suspendu",
  REFUSE: "Refusé",
  INCOMPLET: "Dossier incomplet",
};

/** Pastille de couleur (point). */
export const COULEUR_STATUT: Record<StatutAffichagePro, string> = {
  VALIDE: "bg-emerald-500",
  EN_ATTENTE: "bg-signal",
  SUSPENDU: "bg-rose-500",
  REFUSE: "bg-muted-foreground/60",
  INCOMPLET: "bg-muted-foreground/40",
};

/** Étiquette complète : fond teinté + texte, lisible en clair comme en sombre. */
export const BADGE_STATUT: Record<StatutAffichagePro, string> = {
  VALIDE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  EN_ATTENTE: "bg-signal/10 text-signal",
  SUSPENDU: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  REFUSE: "bg-muted text-muted-foreground",
  INCOMPLET: "bg-muted text-muted-foreground",
};

export function formaterTaille(octets: number | null): string {
  if (octets == null) return "—";
  return octets >= 1_000_000
    ? `${(octets / 1_000_000).toFixed(1).replace(".", ",")} Mo`
    : `${Math.max(1, Math.round(octets / 1000))} Ko`;
}

export function formaterDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}