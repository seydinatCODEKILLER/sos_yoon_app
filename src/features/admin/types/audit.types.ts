import type { PageAdmin } from "./utilisateurs.types";

export interface AdminRef {
  id: string;
  nomComplet: string | null;
}

/** Ligne du journal (spec <EntreeAudit>, + libellé lisible de la cible). */
export interface EntreeAudit {
  id: string;
  date: string | null; // ISO UTC
  admin: AdminRef | null;
  /** Chaîne ouverte : une action ajoutée côté serveur ne doit jamais casser l'écran. */
  action: string | null;
  typeCible: string | null;
  cibleId: string | null;
  /** Nom ou référence de la cible ; absent sur un backend sans le correctif ou si la cible a disparu. */
  cibleLibelle?: string | null;
  motif: string | null;
  observations: string | null;
  adresseIp: string | null;
}

export type PageAudit = PageAdmin<EntreeAudit>;

export interface ParamsAudit {
  /** "TOUTES" ou une valeur de ActionAudit. */
  action: string;
  /** "TOUS" ou une valeur de typeCible. */
  typeCible: string;
  /** yyyy-MM-dd ou chaîne vide. */
  du: string;
  au: string;
  page: number; // 0-indexé, comme l'API
  taille: number;
}