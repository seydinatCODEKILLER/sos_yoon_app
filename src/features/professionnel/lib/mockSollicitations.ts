import type { ApiErreur } from "@/types/api.types";
import type { SollicitationsApi } from "../api/sollicitationsApi";
import type { SollicitationResume } from "../types/dashboard.types";
import type { SollicitationDetail } from "../types/sollicitation.types";
import {
  creerSollicitationMock,
  retirerEnAttenteMock,
  sollicitationsEnAttenteMock,
} from "./mockDashboard";

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const REFUSEES: SollicitationResume[] = [
  {
    ...creerSollicitationMock(11, "NORMAL", "Droit pénal", "Garde à vue d'un proche, besoin d'un avocat.", "Rufisque", "Ibrahima N.", 600, 0, 71),
    statut: "REFUSEE",
  },
];

const HISTORIQUE: SollicitationResume[] = [
  {
    ...creerSollicitationMock(21, "ELEVE", "Droit foncier", "Litige de bornage avec un voisin.", "Dakar · Médina", "Mariama D.", 2880, 0, 90),
    statut: "ACCEPTEE",
  },
  {
    ...creerSollicitationMock(22, "NORMAL", "Droit de la famille", "Pension alimentaire non versée depuis 3 mois.", "Thiès", "Cheikh B.", 4320, 0, 78),
    statut: "EXPIREE",
  },
];

/** WAV silencieux de la bonne durée, pour tester le lecteur sans fichier audio */
let urlAudioMock: string | null = null;
function audioMock(secondes: number) {
  if (urlAudioMock) return urlAudioMock;
  const rate = 8000;
  const n = rate * secondes;
  const buf = new ArrayBuffer(44 + n);
  const v = new DataView(buf);
  const txt = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  txt(0, "RIFF");
  v.setUint32(4, 36 + n, true);
  txt(8, "WAVE");
  txt(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  txt(36, "data");
  v.setUint32(40, n, true);
  new Uint8Array(buf, 44).fill(128);
  urlAudioMock = URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
  return urlAudioMock;
}

function versDetail(s: SollicitationResume): SollicitationDetail {
  const base: SollicitationDetail = {
    ...s,
    description: s.extrait,
    motsCles: [],
    audio: null,
    transcription: null,
    metiersRequis: ["AVOCAT"],
    prestationRecommandee: "CABINET",
    citoyen: { affichage: s.citoyen.affichage, telephone: null, email: null },
  };

  if (s.id === "s1") {
    return {
      ...base,
      description: null,
      audio: { url: audioMock(42), dureeSecondes: 42 },
      transcription:
        "Bonjour Maître, nous sommes trois associés en train de monter une société de paiement digital à Dakar. Nous avons besoin de valider nos statuts et de rédiger le pacte d'actionnaires en urgence avant la signature des investisseurs lundi prochain. Est-il possible de fixer un rendez-vous rapide et d'avoir un retour sur notre draft ? Merci beaucoup !",
    };
  }
  if (s.id === "s2") {
    return {
      ...base,
      description:
        "Rupture abusive de contrat CDI après 5 ans de service. Mon employeur conteste le calcul de mes indemnités de préavis et refuse de me remettre mon certificat de travail.",
      prestationRecommandee: "VISIO",
    };
  }
  return base;
}

export const mockSollicitationsApi: SollicitationsApi = {
  async lister(onglet, page, taille) {
    await wait();
    const tout =
      onglet === "NOUVELLES"
        ? sollicitationsEnAttenteMock()
        : onglet === "REFUSEES"
          ? REFUSEES
          : HISTORIQUE;
    const debut = page * taille;
    return {
      contenu: tout.slice(debut, debut + taille),
      page,
      taille,
      totalElements: tout.length,
      totalPages: Math.max(1, Math.ceil(tout.length / taille)),
    };
  },

  async detail(id) {
    await wait(300);
    const s = [...sollicitationsEnAttenteMock(), ...REFUSEES, ...HISTORIQUE].find(
      (x) => x.id === id,
    );
    if (!s) {
      const erreur: ApiErreur = {
        code: "INTROUVABLE",
        message: "Demande introuvable.",
        horodatage: new Date().toISOString(),
      };
      throw erreur;
    }
    return versDetail(s);
  },

  async refuser(id) {
    await wait(600);
    const s = retirerEnAttenteMock(id);
    if (!s) {
      const erreur: ApiErreur = {
        code: "SOLLICITATION_EXPIREE",
        message: "Cette demande a expiré.",
        horodatage: new Date().toISOString(),
      };
      throw erreur;
    }
    REFUSEES.unshift({ ...s, statut: "REFUSEE" });
    return { sollicitationId: id, statut: "REFUSEE", demandeReaffectee: true };
  },
};