import { METIERS_PRO } from "./professionnels";
import type { NiveauUrgence, StatutDemande } from "../types/demandes.types";
import type { TypeProfession } from "../types/professionnels.types";

/** Famille de couleur d'un statut : une seule palette partagée par badge, pastille et frise. */
export type TonStatut = "alerte" | "recherche" | "cours" | "fin" | "refus" | "neutre";

export const STATUTS: Record<StatutDemande, { libelle: string; ton: TonStatut }> = {
  BROUILLON: { libelle: "Brouillon", ton: "neutre" },
  ENVOYEE: { libelle: "Envoyée", ton: "recherche" },
  ANALYSEE_IA: { libelle: "Analysée", ton: "recherche" },
  EN_ATTENTE_TRIAGE: { libelle: "À qualifier", ton: "alerte" },
  EN_DISPATCH: { libelle: "Recherche en cours", ton: "recherche" },
  RECHERCHE_PROFESSIONNEL: { libelle: "Recherche en cours", ton: "recherche" },
  EN_ATTENTE_ACCEPTATION: { libelle: "En attente d'acceptation", ton: "recherche" },
  ACCEPTEE: { libelle: "Acceptée", ton: "cours" },
  EN_COURS: { libelle: "En cours", ton: "cours" },
  TERMINEE: { libelle: "Terminée", ton: "fin" },
  REFUSEE: { libelle: "Refusée", ton: "refus" },
  ANNULEE: { libelle: "Annulée", ton: "neutre" },
  EXPIRE_FALLBACK: { libelle: "Expirée", ton: "neutre" },
};

export function infoStatut(statut: string | null): { libelle: string; ton: TonStatut } {
  if (statut && statut in STATUTS) return STATUTS[statut as StatutDemande];
  return { libelle: statut ?? "—", ton: "neutre" };
}

export const BADGE_TON: Record<TonStatut, string> = {
  alerte: "bg-signal/10 text-signal",
  recherche: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  cours: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  fin: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  refus: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  neutre: "bg-muted text-muted-foreground",
};

export const POINT_TON: Record<TonStatut, string> = {
  alerte: "bg-signal",
  recherche: "bg-amber-500",
  cours: "bg-blue-500",
  fin: "bg-emerald-500",
  refus: "bg-rose-500",
  neutre: "bg-muted-foreground/60",
};

export const URGENCES: Record<NiveauUrgence, { libelle: string; classe: string }> = {
  NORMAL: { libelle: "Normale", classe: "bg-muted text-muted-foreground" },
  URGENT: { libelle: "Urgente", classe: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
  CRITIQUE: { libelle: "Critique", classe: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" },
};

export function infoUrgence(niveau: string | null): { libelle: string; classe: string } | null {
  return niveau && niveau in URGENCES ? URGENCES[niveau as NiveauUrgence] : null;
}

export function libelleMetier(m: string): string {
  return m in METIERS_PRO ? METIERS_PRO[m as TypeProfession].libelle : m;
}

export function pastilleMetier(m: string): string {
  return m in METIERS_PRO ? METIERS_PRO[m as TypeProfession].pastille : "bg-muted-foreground/50";
}

export const LIBELLE_PRESTATION: Record<string, string> = {
  CABINET: "Rendez-vous au cabinet",
  VISIO: "Visioconférence",
  APPEL: "Appel téléphonique",
  AUDIENCE: "Audience",
};

const MOTIFS_REFUS: Record<string, string> = {
  HORS_COMPETENCE: "Hors compétence",
  INDISPONIBLE: "Indisponible",
  TROP_ELOIGNE: "Trop éloigné",
  REAFFECTEE_ADMIN: "Réaffectée par l'administration",
};

export function libelleMotifRefus(code: string | null): string | null {
  if (!code) return null;
  if (code in MOTIFS_REFUS) return MOTIFS_REFUS[code];
  const t = code.replace(/_/g, " ").toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const TERMINAUX = ["TERMINEE", "ANNULEE", "REFUSEE", "BROUILLON"];

/** Mêmes règles que le backend : on ne propose que ce qu'il acceptera. */
export function peutModifier(statut: string | null): boolean {
  return !!statut && !TERMINAUX.includes(statut);
}

export function peutQualifier(statut: string | null): boolean {
  return peutModifier(statut);
}

export function peutReaffecter(statut: string | null): boolean {
  return peutModifier(statut);
}

/** La relance n'a de sens que tant qu'aucun professionnel n'a pris la demande. */
export function peutRelancer(statut: string | null, professionnel: string | null): boolean {
  return peutModifier(statut) && !professionnel;
}

export function peutAnnuler(statut: string | null): boolean {
  return !!statut && statut !== "ANNULEE" && statut !== "TERMINEE";
}

/** « Pas encore attribuée » n'a de sens que pour une demande encore ouverte. */
export function libelleSansProfessionnel(statut: string | null): string {
  return peutModifier(statut) ? "Pas encore attribuée" : "Aucun professionnel";
}

export function estAQualifier(statut: string | null): boolean {
  return statut === "EN_ATTENTE_TRIAGE";
}

/** 45 s, 4 min, 2 h 10, 3 j. */
export function formaterDuree(secondes: number | null): string {
  if (secondes == null || secondes < 0) return "—";
  if (secondes < 60) return `${Math.max(1, Math.round(secondes))} s`;
  const min = Math.round(secondes / 60);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) {
    const r = min % 60;
    return r === 0 ? `${h} h` : `${h} h ${String(r).padStart(2, "0")}`;
  }
  return `${Math.floor(h / 24)} j`;
}

/** 14/09/2026 à 14:32 */
export function formaterDateHeure(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${date} à ${heure}`;
}

export function formaterDureeAudio(secondes: number | null): string {
  if (secondes == null) return "";
  const m = Math.floor(secondes / 60);
  return `${m}:${String(secondes % 60).padStart(2, "0")}`;
}