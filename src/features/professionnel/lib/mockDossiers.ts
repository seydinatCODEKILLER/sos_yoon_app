import type { ApiErreur } from "@/types/api.types";
import type { DossiersApi } from "../api/dossiersApi";
import type { DossierDetail, DossierResume, StatutDossier } from "../types/dossier.types";

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const il = (jours: number) => new Date(Date.now() - jours * 86_400_000).toISOString();

interface Entree {
  resume: DossierResume;
  detail: DossierDetail;
}

interface NouveauDossier {
  demandeId: string;
  reference: string;
  citoyenNom: string;
  prenom: string;
  nom: string;
  titre: string;
  matiere: string;
  statut: StatutDossier;
  jours: number;
  telephone: string;
  email: string | null;
  commune: string;
  description: string;
}

function entree(n: NouveauDossier): Entree {
  return {
    resume: {
      demandeId: n.demandeId,
      reference: n.reference,
      titre: n.titre,
      citoyenNom: n.citoyenNom,
      matiere: n.matiere,
      statutDossier: n.statut,
      dateOuverture: il(n.jours),
      nombreDocuments: 0,
      messagesNonLus: 0,
    },
    detail: {
      reference: n.reference,
      titre: n.titre,
      statutDossier: n.statut,
      citoyen: {
        id: `c-${n.demandeId}`,
        prenom: n.prenom,
        nom: n.nom,
        telephone: n.telephone,
        email: n.email,
        commune: n.commune,
      },
      demande: {
        description: n.description,
        audio: null,
        transcription: null,
        dateAcceptation: il(n.jours),
        libelleLocalisation: `Dakar, ${n.commune}`,
      },
      conversationId: null,
      messagesNonLus: 0,
      documents: [],
    },
  };
}

let dossiers: Entree[] = [
  entree({
    demandeId: "dos1",
    reference: "SY-00240",
    citoyenNom: "Mme Aïssatou Ba",
    prenom: "Aïssatou",
    nom: "Ba",
    titre: "Procédure de succession et partage successoral",
    matiere: "Droit de la famille",
    statut: "EN_COURS",
    jours: 9,
    telephone: "+221771234567",
    email: "aissatou.ba@senegal-trade.sn",
    commune: "Fann Résidence",
    description:
      "Accompagnement juridique pour le règlement de la succession patrimoniale de feu M. Ba. Inventaire des biens immobiliers situés à Dakar (Fann & Almadies) et Saint-Louis, et rédaction d'une convention de partage amiable entre les 4 héritiers réservataires.",
  }),
  entree({
    demandeId: "dos2",
    reference: "SY-00235",
    citoyenNom: "M. Amadou Sylla",
    prenom: "Amadou",
    nom: "Sylla",
    titre: "Conseil création SARL & Pacte d'actionnaires",
    matiere: "Droit des affaires",
    statut: "EN_COURS",
    jours: 3,
    telephone: "+221778451230",
    email: "a.sylla@fintech-dakar.sn",
    commune: "Almadies",
    description:
      "Création d'une SARL fintech et rédaction du pacte d'actionnaires avant le closing avec les investisseurs.",
  }),
  entree({
    demandeId: "dos3",
    reference: "SY-00230",
    citoyenNom: "M. Cheikh Tidiane Wade",
    prenom: "Cheikh Tidiane",
    nom: "Wade",
    titre: "Litige sur bail commercial & révision loyer",
    matiere: "Droit immobilier",
    statut: "EN_ATTENTE_CLIENT",
    jours: 15,
    telephone: "+221776543210",
    email: null,
    commune: "Sandaga",
    description:
      "Contestation de la révision triennale du loyer d'un bail commercial au marché Sandaga.",
  }),
  entree({
    demandeId: "dos4",
    reference: "SY-00225",
    citoyenNom: "Mme Fatou Kiné Diop",
    prenom: "Fatou Kiné",
    nom: "Diop",
    titre: "Rupture conventionnelle & négociation indemnités",
    matiere: "Droit du travail",
    statut: "CLOTURE",
    jours: 30,
    telephone: "+221775550101",
    email: "fkdiop@exemple.sn",
    commune: "Pikine",
    description: "Négociation des indemnités de départ dans le cadre d'une rupture conventionnelle.",
  }),
];

/** Appelé par le mock de l'acceptation : un dossier naît avec la demande acceptée */
export function creerDossierMock(
  n: Omit<NouveauDossier, "citoyenNom" | "statut" | "jours">,
) {
  dossiers = [
    entree({ ...n, citoyenNom: `${n.prenom} ${n.nom}`, statut: "EN_COURS", jours: 0 }),
    ...dossiers.filter((d) => d.resume.demandeId !== n.demandeId),
  ];
}

const introuvable = (): ApiErreur => ({
  code: "INTROUVABLE",
  message: "Dossier introuvable.",
  horodatage: new Date().toISOString(),
});

export const mockDossiersApi: DossiersApi = {
  async lister(filtre, q, page, taille) {
    await wait();
    const terme = q.toLowerCase();
    const filtres = dossiers.filter(({ resume: r }) => {
      const parStatut =
        filtre === "TOUS" ||
        (filtre === "CLOTURES" ? r.statutDossier === "CLOTURE" : r.statutDossier === filtre);
      const parTexte =
        !terme ||
        [r.citoyenNom, r.reference, r.titre ?? "", r.matiere].some((t) =>
          t.toLowerCase().includes(terme),
        );
      return parStatut && parTexte;
    });
    const debut = page * taille;
    return {
      contenu: filtres.slice(debut, debut + taille).map((e) => e.resume),
      page,
      taille,
      totalElements: filtres.length,
      totalPages: Math.max(1, Math.ceil(filtres.length / taille)),
    };
  },

  async compteurs() {
    await wait(200);
    const nb = (s: StatutDossier) => dossiers.filter((d) => d.resume.statutDossier === s).length;
    return {
      enCours: nb("EN_COURS"),
      enAttenteClient: nb("EN_ATTENTE_CLIENT"),
      clotures: nb("CLOTURE"),
      tous: dossiers.length,
    };
  },

  async detail(id) {
    await wait(250);
    const e = dossiers.find((d) => d.resume.demandeId === id);
    if (!e) throw introuvable();
    return e.detail;
  },

  async changerStatut(id, statut) {
    await wait(300);
    const e = dossiers.find((d) => d.resume.demandeId === id);
    if (!e) throw introuvable();
    e.resume.statutDossier = statut;
    e.detail.statutDossier = statut;
  },

  async cloturer(id) {
    await wait(500);
    const e = dossiers.find((d) => d.resume.demandeId === id);
    if (!e) throw introuvable();
    if (e.resume.statutDossier === "CLOTURE") {
      const erreur: ApiErreur = {
        code: "DOSSIER_DEJA_CLOTURE",
        message: "Ce dossier est déjà clôturé.",
        horodatage: new Date().toISOString(),
      };
      throw erreur;
    }
    e.resume.statutDossier = "CLOTURE";
    e.detail.statutDossier = "CLOTURE";
    return { statutDossier: "CLOTURE", dateCloture: new Date().toISOString() };
  },
};