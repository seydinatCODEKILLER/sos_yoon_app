import type { AbonnementAdmin, CiblePaiement, MoyenPaiement } from "../types/abonnements.types";

export const STATUTS_ABONNEMENT: Record<string, { libelle: string; badge: string; point: string }> = {
  ESSAI: {
    libelle: "En essai",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    point: "bg-blue-500",
  },
  ACTIF: {
    libelle: "Actif",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    point: "bg-emerald-500",
  },
  EXPIRE: {
    libelle: "Expiré",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
    point: "bg-rose-500",
  },
};

export function infoStatutAbonnement(statut: string | null | undefined) {
  return (
    (statut && STATUTS_ABONNEMENT[statut]) || {
      libelle: statut ?? "Inconnu",
      badge: "bg-muted text-muted-foreground",
      point: "bg-muted-foreground/60",
    }
  );
}

export const MOYENS_PAIEMENT: { value: MoyenPaiement; label: string }[] = [
  { value: "WAVE", label: "Wave" },
  { value: "ORANGE_MONEY", label: "Orange Money" },
  { value: "CARTE_BANCAIRE", label: "Carte bancaire" },
];

/** Jours seuls (yyyy-MM-dd) : lus en heure locale, pour ne jamais afficher la veille. */
export function parseJour(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** 25 oct. 2026 */
export function formaterJour(iso: string | null | undefined): string {
  const d = parseJour(iso);
  return d ? d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";
}

/** yyyy-MM-dd du jour, en heure locale. */
export function aujourdhui(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function versJour(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** +1 mois comme LocalDate.plusMonths côté Java : le 31 janvier donne le 28 (ou 29) février. */
function plusUnMois(d: Date): Date {
  const cible = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  const dernier = new Date(cible.getFullYear(), cible.getMonth() + 1, 0).getDate();
  cible.setDate(Math.min(d.getDate(), dernier));
  return cible;
}

/**
 * Période que couvrira un paiement : mêmes règles que le backend (spec 13.32). Si l'abonnement
 * n'est pas échu, on prolonge à partir de sa fin ; sinon, à partir de la date du paiement.
 */
export function periodeCouverte(echeance: string | null, datePaiement: string): { debut: string; fin: string } | null {
  const paiement = parseJour(datePaiement);
  if (!paiement) return null;
  const fin = parseJour(echeance);
  const auj = parseJour(aujourdhui()) as Date;
  const prolonge = fin !== null && fin.getTime() > auj.getTime();
  const base = prolonge ? (fin as Date) : paiement;
  return { debut: versJour(base), fin: versJour(plusUnMois(base)) };
}

/** Fin d'essai pendant l'essai, fin de période sinon. */
export function echeanceDe(a: Pick<AbonnementAdmin, "statut" | "finEssai" | "finPeriode">): string | null {
  return a.statut === "ESSAI" ? a.finEssai : (a.finPeriode ?? a.finEssai);
}

export type UrgenceEcheance = "echu" | "proche" | "normal";

export const SEUIL_ECHEANCE_PROCHE = 7;

export function urgenceEcheance(jours: number | null, statut: string | null): UrgenceEcheance {
  if (statut === "EXPIRE") return "echu";
  if (jours === null) return "normal";
  if (jours < 0) return "echu";
  return jours <= SEUIL_ECHEANCE_PROCHE ? "proche" : "normal";
}

/** « Dans 12 jours », « Demain », « Expiré depuis 3 jours ». */
export function libelleDelai(jours: number | null, statut: string | null): string {
  if (jours === null) return "Échéance inconnue";
  if (statut === "EXPIRE" || jours < 0) {
    const n = Math.abs(jours);
    if (n === 0) return "Expiré aujourd'hui";
    return `Expiré depuis ${n} jour${n > 1 ? "s" : ""}`;
  }
  if (jours === 0) return "Se termine aujourd'hui";
  if (jours === 1) return "Se termine demain";
  return `Dans ${jours} jours`;
}

export function libelleEcheance(statut: string | null): string {
  return statut === "ESSAI" ? "Fin de l'essai" : statut === "EXPIRE" ? "Échéance" : "Fin de période";
}

export const TON_URGENCE: Record<UrgenceEcheance, string> = {
  echu: "text-rose-600 dark:text-rose-400",
  proche: "text-amber-700 dark:text-amber-400",
  normal: "text-muted-foreground",
};

/** 30 000 FCFA */
export function formaterMontant(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

/** Libellé du compte quand il n'est pas actif : un abonnement expiré peut avoir bloqué le compte. */
export function libelleCompteBloque(statutCompte: string | null | undefined): string | null {
  switch ((statutCompte ?? "").toUpperCase()) {
    case "":
    case "ACTIF":
      return null;
    case "SUSPENDU_IMPAYE":
      return "Compte suspendu pour impayé";
    case "SUSPENDU_ADMIN":
      return "Compte désactivé";
    case "EN_ATTENTE_VALIDATION":
      return "Dossier en attente de validation";
    default:
      return null;
  }
}

export function cibleDepuisAbonnement(a: AbonnementAdmin): CiblePaiement {
  return {
    professionnelId: a.professionnelId,
    nomComplet: a.nomComplet ?? "Professionnel",
    montantMensuel: a.montantMensuel ?? null,
    echeance: echeanceDe(a),
    statutCompte: a.statutCompte ?? null,
  };
}