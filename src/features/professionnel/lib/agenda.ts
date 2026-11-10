import { Building2, Gavel, Phone, Video, type LucideIcon } from "lucide-react";
import type { RendezVous, TypeRendezVous } from "../types/agenda.types";

/** Lundi à dimanche : un rendez-vous créé un dimanche doit rester visible */
export const JOURS_AFFICHES = 7;
/** Hauteur d'une heure dans la grille, en pixels */
export const HAUTEUR_HEURE = 56;
/** La grille couvre au moins cette plage et s'élargit si un rendez-vous en sort */
export const HEURE_MIN_PAR_DEFAUT = 7;
export const HEURE_MAX_PAR_DEFAUT = 20;

export const TYPES_RDV_CONFIG: Record<
  TypeRendezVous,
  {
    libelle: string;
    /** Fond du bloc dans la grille */
    bloc: string;
    /** Trait de couleur à gauche du bloc */
    barre: string;
    /** Pastille des filtres */
    point: string;
    badge: string;
    icone: LucideIcon;
  }
> = {
  AUDIENCE: {
    libelle: "Audience",
    bloc: "bg-red-50 text-red-950 hover:bg-red-100",
    barre: "bg-red-500",
    point: "bg-red-500",
    badge: "bg-red-100 text-red-700",
    icone: Gavel,
  },
  APPEL: {
    libelle: "Appel",
    bloc: "bg-amber-50 text-amber-950 hover:bg-amber-100",
    barre: "bg-amber-500",
    point: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800",
    icone: Phone,
  },
  VISIO: {
    libelle: "Visio",
    bloc: "bg-violet-50 text-violet-950 hover:bg-violet-100",
    barre: "bg-violet-500",
    point: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700",
    icone: Video,
  },
  CABINET: {
    libelle: "Cabinet",
    bloc: "bg-navy/8 text-navy hover:bg-navy/14",
    barre: "bg-navy",
    point: "bg-navy",
    badge: "bg-navy/10 text-navy",
    icone: Building2,
  },
};

const deux = (n: number) => String(n).padStart(2, "0");

/** AAAA-MM-JJ en heure locale */
export const cleJour = (d: Date) =>
  `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;

export function ajouterJours(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function lundiDe(d: Date) {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  r.setDate(r.getDate() - ((r.getDay() + 6) % 7));
  return r;
}

/** « 09h00 » */
export const heure = (iso: string) =>
  new Date(iso)
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h");

/** Découpe une date ISO en champs de formulaire (heure locale) */
export function deIso(iso: string) {
  const d = new Date(iso);
  return { date: cleJour(d), heure: `${deux(d.getHours())}:${deux(d.getMinutes())}` };
}

/** Heure locale saisie → instant UTC (le backend attend de l'ISO 8601 UTC) */
export const versIso = (date: string, hhmm: string) => new Date(`${date}T${hhmm}`).toISOString();

/** « 14:30 » + 1 → « 15:30 » (plafonné à 23:59) */
export function ajouterHeures(hhmm: string, n: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + n * 60;
  if (total >= 24 * 60) return "23:59";
  return `${deux(Math.floor(total / 60))}:${deux(total % 60)}`;
}

export function libelleSemaine(lundi: Date) {
  const fin = ajouterJours(lundi, JOURS_AFFICHES - 1);
  const mois = (d: Date) => d.toLocaleDateString("fr-FR", { month: "long" });
  return lundi.getMonth() === fin.getMonth()
    ? `${lundi.getDate()} – ${fin.getDate()} ${mois(fin)} ${fin.getFullYear()}`
    : `${lundi.getDate()} ${mois(lundi)} – ${fin.getDate()} ${mois(fin)} ${fin.getFullYear()}`;
}

export function enteteJour(d: Date) {
  const court = d.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
  return {
    court: court.charAt(0).toUpperCase() + court.slice(1),
    numero: d.getDate(),
    date: d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }),
    long: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
  };
}

/** « 1 h 30 », « 45 min » */
export function libelleDuree(debutIso: string, finIso: string) {
  const min = Math.round((new Date(finIso).getTime() - new Date(debutIso).getTime()) / 60000);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const reste = min % 60;
  return reste ? `${h} h ${deux(reste)}` : `${h} h`;
}

/* ── Placement dans la grille horaire ────────────────────────── */

export const minutesDuJour = (d: Date) => d.getHours() * 60 + d.getMinutes();

export interface Placement {
  rdv: RendezVous;
  /** Minutes depuis minuit, heure locale */
  debutMin: number;
  finMin: number;
  /** Colonne occupée parmi celles du groupe de rendez-vous qui se chevauchent */
  voie: number;
  voies: number;
}

/** Rendez-vous d'une même journée : ceux qui se chevauchent sont placés côte à côte */
export function disposerJour(rdvs: RendezVous[]): Placement[] {
  const items = rdvs
    .map((rdv) => {
      const debut = new Date(rdv.debut);
      const fin = new Date(rdv.fin);
      const debutMin = minutesDuJour(debut);
      // Un rendez-vous qui finit un autre jour local est arrêté à minuit
      const finMin = cleJour(fin) === cleJour(debut) ? minutesDuJour(fin) : 24 * 60;
      return { rdv, debutMin, finMin: Math.max(finMin, debutMin + 15) };
    })
    .sort((a, b) => a.debutMin - b.debutMin || a.finMin - b.finMin);

  const resultat: Placement[] = [];
  let groupe: Placement[] = [];
  let finGroupe = -1;
  const finsVoies: number[] = [];

  const fermerGroupe = () => {
    const voies = Math.max(...groupe.map((p) => p.voie)) + 1;
    for (const p of groupe) p.voies = voies;
    resultat.push(...groupe);
    groupe = [];
    finsVoies.length = 0;
  };

  for (const it of items) {
    if (groupe.length > 0 && it.debutMin >= finGroupe) fermerGroupe();
    let voie = finsVoies.findIndex((fin) => fin <= it.debutMin);
    if (voie === -1) voie = finsVoies.length;
    finsVoies[voie] = it.finMin;
    groupe.push({ ...it, voie, voies: 1 });
    finGroupe = Math.max(finGroupe, it.finMin);
  }
  if (groupe.length > 0) fermerGroupe();
  return resultat;
}

/** Heures entières couvertes par la grille (au moins 7 h – 20 h) */
export function plageHoraire(rdvs: RendezVous[]) {
  let debut = HEURE_MIN_PAR_DEFAUT;
  let fin = HEURE_MAX_PAR_DEFAUT;
  for (const rdv of rdvs) {
    const d = new Date(rdv.debut);
    const f = new Date(rdv.fin);
    debut = Math.min(debut, d.getHours());
    fin = Math.max(fin, cleJour(f) === cleJour(d) ? f.getHours() + (f.getMinutes() > 0 ? 1 : 0) : 24);
  }
  return { debut, fin: Math.min(fin, 24) };
}

export function prochainRendezVous(rdvs: RendezVous[], maintenant: Date) {
  const t = maintenant.getTime();
  return rdvs
    .filter((r) => new Date(r.fin).getTime() > t)
    .sort((a, b) => new Date(a.debut).getTime() - new Date(b.debut).getTime())[0];
}