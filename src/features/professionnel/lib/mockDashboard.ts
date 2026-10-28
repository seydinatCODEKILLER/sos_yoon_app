import type { ApiErreur } from "@/types/api.types";
import type { DashboardApi } from "../api/dashboardApi";
import type {
  NiveauUrgence,
  Periode,
  SollicitationResume,
  TableauDeBord,
} from "../types/dashboard.types";
import { creerDossierMock } from "./mockDossiers";
import { mockAbonnementApi } from "./mockAbonnement";

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const introuvable = (): ApiErreur => ({
  code: "SOLLICITATION_EXPIREE",
  message: "Cette demande a expiré.",
  horodatage: new Date().toISOString(),
});

export function creerSollicitationMock(
  n: number,
  niveau: NiveauUrgence,
  matiere: string,
  extrait: string,
  lieu: string,
  citoyen: string,
  ilYaMinutes: number,
  secondesRestantes: number,
  score: number,
  vocal = false,
): SollicitationResume {
  const maintenant = Date.now();
  return {
    id: `s${n}`,
    demandeId: `d${n}`,
    reference: `SY-${String(247 + n).padStart(5, "0")}`,
    niveauUrgence: niveau,
    matiere,
    extrait,
    typeSaisie: vocal ? "VOCAL" : "TEXTE",
    dureeAudioSecondes: vocal ? 42 : null,
    libelleLocalisation: lieu,
    distanceKm: 4.2,
    scoreCorrespondance: score,
    recueLe: new Date(maintenant - ilYaMinutes * 60_000).toISOString(),
    expireLe: new Date(maintenant + secondesRestantes * 1000).toISOString(),
    secondesRestantes,
    statut: "EN_ATTENTE",
    citoyen: { affichage: citoyen },
  };
}

let disponible = true;
let urgentes: SollicitationResume[] = [
  creerSollicitationMock(
    1,
    "CRITIQUE",
    "Droit des affaires & Sociétés",
    "Conseil création SARL & Pacte d'actionnaires pour startup fintech avant closing investisseurs.",
    "Dakar · Almadies",
    "Amadou Sylla",
    4,
    160,
    98,
    true,
  ),
  creerSollicitationMock(
    2,
    "ELEVE",
    "Droit du travail & Licenciement",
    "Rupture abusive de contrat CDI après 5 ans de service, calcul d'indemnités de préavis contesté.",
    "Pikine / Guédiawaye",
    "Fatou Kiné Diop",
    18,
    720,
    92,
  ),
  creerSollicitationMock(
    3,
    "NORMAL",
    "Droit commercial",
    "Recouvrement créance impayée fournisseur.",
    "Dakar · Plateau",
    "Keur Khadim",
    35,
    1500,
    84,
  ),
];

/** Partagé avec l'écran Demandes (onglet Nouvelles) */
export function sollicitationsEnAttenteMock() {
  return urgentes;
}

/** Retire une demande de la liste « en attente » (utilisé par le mock du refus) */
export function retirerEnAttenteMock(id: string) {
  const trouvee = urgentes.find((x) => x.id === id);
  if (trouvee) urgentes = urgentes.filter((x) => x.id !== id);
  return trouvee;
}

function evolution(periode: Periode) {
  const jours = periode === "7j" ? 7 : 30;
  return Array.from({ length: jours }, (_, i) => ({
    date: new Date(Date.now() - (jours - 1 - i) * 86_400_000)
      .toISOString()
      .slice(0, 10),
    total: 2 + ((i * 5 + (i % 3) * 2) % 7),
  }));
}

export const mockDashboardApi: DashboardApi = {
  async tableauDeBord(periode) {
    await wait();
    const data: TableauDeBord = {
      disponible,
      demandesRecues: {
        total: periode === "7j" ? 28 : 96,
        variationPourcent: periode === "7j" ? 14 : -6,
      },
      dossiersEnCours: 12,
      tauxAcceptation: 92,
      delaiMoyenReponseSecondes: 6300,
      sollicitationsEnAttente: urgentes.length,
      urgentes,
      evolution: evolution(periode),
    };
    return data;
  },

  async changerDisponibilite(valeur) {
    await wait(250);
    disponible = valeur;
  },

  async abonnement() {
    return mockAbonnementApi.detail();
  },

  async accepterSollicitation(id) {
    await wait(600);
    const s = urgentes.find((x) => x.id === id);
    if (!s) throw introuvable();
    urgentes = urgentes.filter((x) => x.id !== id);

    const [prenom, ...reste] = s.citoyen.affichage.split(" ");
    creerDossierMock({
      demandeId: s.demandeId,
      reference: s.reference,
      prenom,
      nom: reste.join(" "),
      titre: s.extrait,
      matiere: s.matiere,
      telephone: "+221778451230",
      email: s.id === "s1" ? "a.sylla@fintech-dakar.sn" : null,
      commune: s.libelleLocalisation,
      description: s.extrait,
    });
    return {
      sollicitationId: s.id,
      demandeId: s.demandeId,
      reference: s.reference,
      statutDossier: "EN_COURS",
      conversationId: `conv-${s.id}`,
      premierContactAvant: new Date(Date.now() + 2 * 3600_000).toISOString(),
      citoyen: {
        id: `c-${s.id}`,
        prenom,
        nom: reste.join(" "),
        telephone: "+221778451230",
        // Un cas sans email pour tester l'affichage « Non renseigné »
        email: s.id === "s1" ? "a.sylla@fintech-dakar.sn" : null,
        photoUrl: null,
        commune: s.libelleLocalisation,
      },
    };
  },
};
