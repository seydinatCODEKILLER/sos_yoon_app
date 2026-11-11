import type { NiveauAdmin, ParametreAdmin } from "../types/parametres.types";

// ── Profil ─────────────────────────────────────────────────────────────────

const LIBELLES_NIVEAU: Record<string, string> = {
  ADMIN: "Administrateur",
  SUPER_ADMIN: "Super administrateur",
};

export function libelleNiveau(niveau: NiveauAdmin | null | undefined): string {
  return (niveau && LIBELLES_NIVEAU[niveau]) || "Administrateur";
}

/** Espaces d'administration accessibles à tout compte admin (le serveur ne distingue pas encore les niveaux). */
export const ACCES_ADMIN = ["Demandes", "Utilisateurs", "Professionnels", "Abonnements", "Paramètres", "Journal d'audit"];

/** « +221771234567 » → « 77 123 45 67 » (pour le champ qui porte déjà le préfixe +221). */
export function sansIndicatif(telephone: string | null | undefined): string {
  const chiffres = (telephone ?? "").replace(/\D/g, "").replace(/^221/, "").slice(0, 9);
  if (chiffres.length !== 9) return chiffres;
  return `${chiffres.slice(0, 2)} ${chiffres.slice(2, 5)} ${chiffres.slice(5, 7)} ${chiffres.slice(7)}`;
}

// ── Sessions ───────────────────────────────────────────────────────────────

export function estMobile(appareil: string | null | undefined): boolean {
  return /android|iphone|ipad|ios|mobile/i.test(appareil ?? "");
}

/**
 * « il y a 5 min » à partir d'une date ISO. `maintenant` vient de l'appelant (dataUpdatedAt de la
 * requête) pour que le rendu reste pur ; une date absente ou illisible ne casse pas l'écran.
 */
export function depuis(iso: string | null | undefined, maintenant: number): string {
  const t = iso ? Date.parse(iso) : NaN;
  if (Number.isNaN(t)) return "à une date inconnue";
  const min = Math.floor((maintenant - t) / 60_000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const j = Math.floor(h / 24);
  if (j < 7) return `il y a ${j} j`;
  return `le ${new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
}

// ── Paramètres de la plateforme ────────────────────────────────────────────

export interface MetaParametre {
  libelle: string;
  unite: string;
  groupe: string;
  /** false : le serveur enregistre la valeur mais aucun traitement ne la lit encore. */
  applique: boolean;
}

export const GROUPES_PARAMETRES = ["Abonnements", "Demandes et mise en relation", "Fichiers"] as const;
const AUTRES = "Autres paramètres";

const META: Record<string, MetaParametre> = {
  "abonnement.montant.standard.xof": {
    libelle: "Mensualité standard",
    unite: "FCFA / mois",
    groupe: "Abonnements",
    applique: true,
  },
  "abonnement.montant.juriste_conseil.xof": {
    libelle: "Mensualité juriste-conseil",
    unite: "FCFA / mois",
    groupe: "Abonnements",
    applique: true,
  },
  "abonnement.essai.jours": {
    libelle: "Durée de l'essai gratuit",
    unite: "jours",
    groupe: "Abonnements",
    applique: true,
  },
  "sollicitation.expiration.minutes": {
    libelle: "Délai de réponse du professionnel sollicité",
    unite: "minutes",
    groupe: "Demandes et mise en relation",
    applique: true,
  },
  "dispatch.professionnels.limit": {
    libelle: "Professionnels dans la file d'une demande",
    unite: "professionnels",
    groupe: "Demandes et mise en relation",
    applique: true,
  },
  "demande.expiration.heures": {
    libelle: "Expiration d'une demande sans réponse",
    unite: "heures",
    groupe: "Demandes et mise en relation",
    applique: false,
  },
  "relance.professionnel.heures": {
    libelle: "Délai avant relance d'un professionnel silencieux",
    unite: "heures",
    groupe: "Demandes et mise en relation",
    applique: false,
  },
  "upload.taille.max.mo": {
    libelle: "Taille maximale d'un fichier téléversé",
    unite: "Mo",
    groupe: "Fichiers",
    applique: false,
  },
};

export function metaParametre(p: Pick<ParametreAdmin, "cle" | "description">): MetaParametre {
  return META[p.cle] ?? { libelle: p.description || p.cle, unite: "", groupe: AUTRES, applique: true };
}

export interface GroupeParametres {
  titre: string;
  parametres: ParametreAdmin[];
}

/** Regroupe et ordonne les paramètres pour l'affichage (groupes connus d'abord, puis les autres). */
export function grouperParametres(liste: ParametreAdmin[]): GroupeParametres[] {
  const ordre: string[] = [...GROUPES_PARAMETRES, AUTRES];
  const parGroupe = new Map<string, ParametreAdmin[]>();
  for (const p of liste) {
    const g = metaParametre(p).groupe;
    parGroupe.set(g, [...(parGroupe.get(g) ?? []), p]);
  }
  const cles = Object.keys(META);
  return ordre
    .filter((g) => parGroupe.has(g))
    .map((g) => ({
      titre: g,
      parametres: [...(parGroupe.get(g) ?? [])].sort((a, b) => {
        const ia = cles.indexOf(a.cle);
        const ib = cles.indexOf(b.cle);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.cle.localeCompare(b.cle);
      }),
    }));
}

/** Même règle que le serveur : un paramètre numérique reste un entier strictement positif (9 chiffres max). */
export function erreurValeurParametre(valeurInitiale: string, saisie: string): string | null {
  const v = saisie.trim();
  if (!v) return "La valeur est obligatoire.";
  if (/^\d+$/.test(valeurInitiale.trim()) && !/^[1-9]\d{0,8}$/.test(v)) {
    return "Saisissez un nombre entier positif (sans espace ni virgule).";
  }
  return null;
}