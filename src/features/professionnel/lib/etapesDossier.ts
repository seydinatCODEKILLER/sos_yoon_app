import type {
  CodeEtapeDossier,
  EtapeDossier,
  StatutDossier,
} from "../types/dossierPro.types";

export type EtatEtape = "faite" | "en-cours" | "a-venir" | "refusee";

/** Ce que dit l'écran de l'étape sur laquelle le dossier se trouve */
const DETAIL: Record<CodeEtapeDossier, { titre: string; texte: string }> = {
  INFORMATIONS: {
    titre: "Informations reçues",
    texte:
      "Votre identité, vos spécialités et l'adresse de votre cabinet sont enregistrées.",
  },
  DOCUMENTS: {
    titre: "Pièces transmises",
    texte: "Vos justificatifs sont bien arrivés. L'examen va commencer.",
  },
  VERIFICATION: {
    titre: "Vérification en cours",
    texte:
      "Notre équipe contrôle vos pièces auprès de l'ordre professionnel et certifie votre profil.",
  },
  ACTIVATION: {
    titre: "Activation de votre espace",
    texte:
      "Votre espace s'ouvre dès que la vérification est terminée : demandes, dossiers et agenda.",
  },
};

export function etatEtape(
  etape: EtapeDossier,
  statut: StatutDossier["statut"],
): EtatEtape {
  if (statut === "REJETE" && etape.code === "VERIFICATION") return "refusee";
  if (etape.etat === "FAIT") return "faite";
  if (etape.etat === "EN_COURS") return "en-cours";
  return "a-venir";
}

/** L'étape à expliquer sous la barre */
export function detailEtapeCourante(
  etapes: EtapeDossier[],
  statut: StatutDossier["statut"],
): { titre: string; texte: string } | null {
  const courante =
    statut === "REJETE"
      ? etapes.find((e) => e.code === "VERIFICATION")
      : (etapes.find((e) => e.etat === "EN_COURS") ??
        [...etapes].reverse().find((e) => e.etat === "FAIT"));
  if (!courante) return null;
  const detail = DETAIL[courante.code];
  if (!detail) return { titre: courante.libelle, texte: "" };
  return statut === "REJETE"
    ? { titre: "Vérification non concluante", texte: detail.texte }
    : detail;
}