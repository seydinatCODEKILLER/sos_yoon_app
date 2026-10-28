import type { TypeProfession } from "../types/profil.types";

export const LIBELLE_PROFESSION: Record<TypeProfession, string> = {
  AVOCAT: "Avocat",
  HUISSIER: "Huissier de justice",
  NOTAIRE: "Notaire",
  JURISTE_CONSEIL: "Juriste-conseil",
};

export function initialesProfil(prenom: string, nom: string) {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

export function formaterDelaiMoyen(secondes: number) {
  const min = Math.round(secondes / 60);
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
}