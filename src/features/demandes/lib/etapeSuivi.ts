import type { TimelineItem } from "../components/SuiviTimeline";
import type { CodeEtape, EtapeSuivi, EtatEtape } from "../types/demande.types";
import { formatHeure } from "./formatDateDemande";

const STATUS: Record<EtatEtape, TimelineItem["status"]> = {
  FAIT: "done",
  EN_COURS: "current",
  A_VENIR: "pending",
};

/** Texte d'accompagnement de chaque étape (le libellé vient du serveur) */
const DESCRIPTIONS: Record<CodeEtape, string> = {
  DEMANDE_ENVOYEE: "Reçue par le système central SOS Yoon",
  SITUATION_ANALYSEE: "Qualification de votre situation",
  PROFESSIONNEL_IDENTIFIE: "Un professionnel de votre secteur est sollicité",
  DEMANDE_ACCEPTEE: "Attribution confirmée",
  ECHANGE_EN_DIRECT: "Échange direct avec le professionnel",
  CLOTURE: "Clôture et compte-rendu",
};

/**
 * Convertit les `etapes` du suivi (spec 8.3) en éléments de frise.
 * `codes` permet de n'afficher qu'une partie de la frise.
 */
export function etapesVersTimeline(
  etapes: EtapeSuivi[],
  options: { codes?: CodeEtape[] } = {},
): TimelineItem[] {
  const visibles = options.codes
    ? etapes.filter((e) => options.codes!.includes(e.code))
    : etapes;

  return visibles.map((e) => ({
    id: e.code,
    titre: e.libelle,
    description: DESCRIPTIONS[e.code],
    status: STATUS[e.etat],
    heure:
      e.etat === "FAIT" && e.date
        ? formatHeure(e.date)
        : e.etat === "EN_COURS"
          ? "En cours…"
          : undefined,
  }));
}

/** Date de l'envoi de la demande (première étape) */
export const dateEnvoiSuivi = (etapes: EtapeSuivi[]) =>
  etapes.find((e) => e.code === "DEMANDE_ENVOYEE")?.date ?? null;