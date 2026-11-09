import type { DemandeResume } from "../types/demande.types";

/**
 * Couleur du statut :
 * - actif : la plateforme travaille (orange)
 * - succes : un professionnel est affecté ou la demande est terminée (vert)
 * - alerte : la demande attend une intervention de l'équipe, ou est restée sans réponse (ambre)
 * - neutre : demande annulée
 */
export type TonStatut = "actif" | "succes" | "alerte" | "neutre";

export const NB_ETAPES = 4;

export interface EtatDemande {
  /** 1 envoyée · 2 professionnel recherché ou sollicité · 3 prise en charge · 4 terminée */
  etape: 1 | 2 | 3 | 4;
  libelle: string;
  ton: TonStatut;
  /** Demande encore ouverte */
  ouverte: boolean;
}

/** Traduit le statut serveur en ce que le citoyen doit lire dans la liste */
export function etatDemande(
  demande: Pick<DemandeResume, "statut" | "professionnel">,
): EtatDemande {
  switch (demande.statut) {
    case "TERMINEE":
      return { etape: 4, libelle: "Terminée", ton: "succes", ouverte: false };
    case "ANNULEE":
      return { etape: 1, libelle: "Annulée", ton: "neutre", ouverte: false };
    case "REFUSEE":
      return { etape: 1, libelle: "Refusée", ton: "neutre", ouverte: false };
    case "EXPIRE_FALLBACK":
      return { etape: 2, libelle: "Sans réponse", ton: "alerte", ouverte: false };
    case "ACCEPTEE":
    case "EN_COURS":
      return {
        etape: 3,
        libelle: "Prise en charge",
        ton: "succes",
        ouverte: true,
      };
    case "EN_ATTENTE_ACCEPTATION":
      return {
        etape: 2,
        libelle: "Professionnel sollicité",
        ton: "actif",
        ouverte: true,
      };
    case "RECHERCHE_PROFESSIONNEL":
      return {
        etape: 2,
        libelle: "Transmise à l'équipe SOS Yoon",
        ton: "alerte",
        ouverte: true,
      };
    case "EN_ATTENTE_TRIAGE":
      return {
        etape: 1,
        libelle: "Examinée par notre équipe",
        ton: "actif",
        ouverte: true,
      };
    default:
      // BROUILLON, ENVOYEE, ANALYSEE_IA, EN_DISPATCH
      return { etape: 1, libelle: "Analyse en cours", ton: "actif", ouverte: true };
  }
}

/** Classes Tailwind par ton (fond léger, texte, couleur pleine pour les barres et points) */
export const TONS: Record<
  TonStatut,
  { texte: string; fond: string; plein: string }
> = {
  actif: { texte: "text-signal", fond: "bg-signal/10", plein: "bg-signal" },
  succes: {
    texte: "text-emerald-700",
    fond: "bg-emerald-50",
    plein: "bg-emerald-600",
  },
  alerte: {
    texte: "text-amber-700",
    fond: "bg-amber-50",
    plein: "bg-amber-500",
  },
  neutre: { texte: "text-ink/60", fond: "bg-ink/5", plein: "bg-ink/30" },
};