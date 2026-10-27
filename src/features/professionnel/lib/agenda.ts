import { Building2, Gavel, Phone, Video, type LucideIcon } from "lucide-react";
import type { TypeRendezVous } from "../types/agenda.types";

export const JOURS_AFFICHES = 6; // lundi à samedi, comme la maquette

export const TYPES_RDV_CONFIG: Record<
  TypeRendezVous,
  { libelle: string; carte: string; badge: string; icone: LucideIcon }
> = {
  AUDIENCE: {
    libelle: "Audience",
    carte: "border-red-200 bg-red-50",
    badge: "bg-red-100 text-red-700",
    icone: Gavel,
  },
  APPEL: {
    libelle: "Appel",
    carte: "border-amber-200 bg-amber-50",
    badge: "bg-amber-100 text-amber-800",
    icone: Phone,
  },
  VISIO: {
    libelle: "Visio",
    carte: "border-violet-200 bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    icone: Video,
  },
  CABINET: {
    libelle: "Cabinet",
    carte: "border-ink/10 bg-white",
    badge: "bg-ink/8 text-ink/70",
    icone: Building2,
  },
};

const deux = (n: number) => String(n).padStart(2, "0");

/** AAAA-MM-JJ en heure locale */
export const cleJour = (d: Date) => `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;

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

export const heure = (iso: string) =>
  new Date(iso)
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h");

/** Découpe une date ISO en champs de formulaire (heure locale) */
export function deIso(iso: string) {
  const d = new Date(iso);
  return { date: cleJour(d), heure: `${deux(d.getHours())}:${deux(d.getMinutes())}` };
}

export const versIso = (date: string, hhmm: string) => new Date(`${date}T${hhmm}`).toISOString();

export function libelleSemaine(lundi: Date) {
  const fin = ajouterJours(lundi, JOURS_AFFICHES - 1);
  const mois = (d: Date) => d.toLocaleDateString("fr-FR", { month: "long" });
  return lundi.getMonth() === fin.getMonth()
    ? `Semaine du ${lundi.getDate()} au ${fin.getDate()} ${mois(fin)} ${fin.getFullYear()}`
    : `Semaine du ${lundi.getDate()} ${mois(lundi)} au ${fin.getDate()} ${mois(fin)} ${fin.getFullYear()}`;
}

export function enteteJour(d: Date) {
  const court = d.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
  return {
    court: court.charAt(0).toUpperCase() + court.slice(1),
    date: d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }),
  };
}