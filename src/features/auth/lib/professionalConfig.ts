import type { Metier } from "@/types/user.types";

export type DocumentField =
  | "diplome"
  | "pieceIdentite"
  | "carteProfessionnelle";

export interface RequiredDocument {
  field: DocumentField;
  label: string;
  hint: string;
  required: boolean;
}

export interface MetierVerification {
  /** Complète la phrase "…pour certifier votre statut de {statut}." */
  statut: string;
  documents: RequiredDocument[];
  /** Texte de la case à cocher obligatoire, ou null si non requise. */
  declaration: string | null;
}

export const DOCUMENTS_BY_METIER: Record<Metier, MetierVerification> = {
  JURISTE_CONSEIL: {
    statut: "juriste-conseil",
    documents: [
      {
        field: "diplome",
        label: "Diplôme en droit",
        hint: "Licence ou Master en droit (PDF, JPG ou PNG)",
        required: true,
      },
      {
        field: "pieceIdentite",
        label: "Pièce d'identité",
        hint: "CNI ou passeport en cours de validité",
        required: true,
      },
    ],
    declaration:
      "Je certifie être juriste-conseil, apte à exercer, et je certifie l'authenticité de ma pièce d'identité et de mon diplôme en droit fournis à l'inscription. J'accepte que ma responsabilité personnelle soit engagée en cas de fausse déclaration ou de document falsifié.",
  },
  // Spec 4.1 : CARTE_PRO est obligatoire pour un avocat, un huissier et un notaire
  // (le serveur répond 422 DOSSIER_INCOMPLET sinon).
  AVOCAT: {
    statut: "officier de justice",
    documents: [
      {
        field: "carteProfessionnelle",
        label: "Carte professionnelle",
        hint: "En cours de validité, lisible (PDF, JPG ou PNG)",
        required: true,
      },
    ],
    declaration: null,
  },
  HUISSIER: {
    statut: "officier de justice",
    documents: [
      {
        field: "carteProfessionnelle",
        label: "Carte professionnelle",
        hint: "En cours de validité, lisible (PDF, JPG ou PNG)",
        required: true,
      },
    ],
    declaration: null,
  },
  NOTAIRE: {
    statut: "officier de justice",
    documents: [
      {
        field: "carteProfessionnelle",
        label: "Carte professionnelle",
        hint: "En cours de validité, lisible (PDF, JPG ou PNG)",
        required: true,
      },
    ],
    declaration: null,
  },
};

// ⚠️ Plus utilisées : les spécialités viennent de GET /referentiels/specialites, et l'organisme,
// l'expérience, les langues et les tarifs ne font plus partie du modèle (spec 4.1). À supprimer
// quand plus aucun écran ne les importe.
export const ORGANISMES_BY_METIER: Record<Metier, string[]> = {
  AVOCAT: ["Ordre des Avocats du Sénégal"],
  HUISSIER: ["Chambre nationale des huissiers de justice"],
  NOTAIRE: ["Chambre des notaires du Sénégal"],
  JURISTE_CONSEIL: [
    "Cabinet de conseil juridique",
    "Direction juridique d'entreprise",
    "Indépendant",
    "Autre",
  ],
};

export const SPECIALITES_BY_METIER: Record<Metier, string[]> = {
  AVOCAT: [
    "Droit pénal",
    "Droit des affaires",
    "Droit familial",
    "Droit du travail",
    "Droit immobilier",
    "Droit administratif",
    "Droit des étrangers",
    "Autre",
  ],
  HUISSIER: [
    "Constats",
    "Significations",
    "Recouvrement",
    "Exécution des décisions",
    "Expulsions",
    "Autre",
  ],
  NOTAIRE: [
    "Immobilier",
    "Successions",
    "Droit de la famille",
    "Droit des sociétés",
    "Contrats",
    "Autre",
  ],
  JURISTE_CONSEIL: [
    "Droit des affaires",
    "Droit du travail",
    "Contrats",
    "Conformité",
    "Propriété intellectuelle",
    "Autre",
  ],
};

export const EXPERIENCE_RANGES = [
  "Moins de 1 an",
  "1 à 5 ans",
  "6 à 10 ans (Ex. 7 ans)",
  "11 à 20 ans",
  "Plus de 20 ans",
] as const;

export const LANGUES = [
  "Français",
  "Wolof",
  "Anglais",
  "Arabe",
  "Pulaar / Peulh",
  "Autre",
] as const;

export const MODALITES_FACTURATION = [
  "Par consultation (Forfait)",
  "À l'heure",
  "Au dossier",
  "Sur devis",
] as const;

export function getInscriptionYears(): string[] {
  const current = new Date().getFullYear();
  return Array.from({ length: current - 1969 }, (_, i) => String(current - i));
}