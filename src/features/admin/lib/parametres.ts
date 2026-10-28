import type { NiveauAdmin } from "../types/parametres.types";

export const LIBELLE_NIVEAU: Record<NiveauAdmin, string> = {
  SUPER_ADMIN: "Super Administrateur",
  ADMIN: "Administrateur",
};

// Déduits du niveau tant que l'API ne renvoie pas de privilèges
export const PRIVILEGES_PAR_NIVEAU: Record<NiveauAdmin, string[]> = {
  SUPER_ADMIN: ["Homologation praticiens", "Gestion utilisateurs", "Supervision des demandes"],
  ADMIN: ["Gestion utilisateurs", "Supervision des demandes"],
};

export const sansIndicatif = (tel: string) => tel.replace(/^\+221/, "");

export function depuis(iso: string, maintenant: number): string {
  const min = Math.max(0, Math.floor((maintenant - new Date(iso).getTime()) / 60_000));
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} heure${h > 1 ? "s" : ""}`;
  const j = Math.floor(h / 24);
  return `il y a ${j} jour${j > 1 ? "s" : ""}`;
}

export const estMobile = (appareil: string) => /iphone|ipad|android|app/i.test(appareil);