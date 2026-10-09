import type { ApiErreur } from "@/types/api.types";
import type { DemandeDetail, MotCleFrequent } from "../types/demande.types";
import type { DemandesApi } from "../api/demandeApi";

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// MOCK : les codes viennent de la maquette, sauf EXPULSION_LOCATIVE (cité dans le document)
const MOTS_CLES: MotCleFrequent[] = [
  { motCle: "GARDE_A_VUE", libelle: "Garde à vue immédiate" },
  { motCle: "EXPULSION_LOCATIVE", libelle: "Expulsion locative" },
  { motCle: "CONSTAT_HUISSIER", libelle: "Constat d'huissier urgent" },
  { motCle: "LITIGE_EMPLOYEUR", libelle: "Litige employeur / Licenciement" },
];

const brouillons = new Map<string, DemandeDetail>();
let compteur = 248;

const introuvable = (): ApiErreur => ({
  code: "INTROUVABLE",
  message: "Demande introuvable.",
  horodatage: new Date().toISOString(),
});

export const mockDemandesApi: DemandesApi = {
  async creer(payload) {
    await wait();
    const demande: DemandeDetail = {
      id: crypto.randomUUID(),
      reference: `SY-${String(++compteur).padStart(5, "0")}`,
      titre: null,
      typeSaisie: payload.typeSaisie,
      description: payload.description ?? null,
      motsCles: payload.motsCles,
      audio: null,
      transcription: null,
      statut: "BROUILLON",
      niveauUrgence: null,
      matiere: null,
      metiersRequis: [],
      localisation: null,
      dateCreation: new Date().toISOString(),
      dateEnvoi: null,
      professionnel: null,
      conversationId: null,
      compteRenduDisponible: false,
      avisDonne: false,
    };
    brouillons.set(demande.id, demande);
    return demande;
  },

  async modifier(id, payload) {
    await wait();
    const existant = brouillons.get(id);
    if (!existant) throw introuvable();
    const maj: DemandeDetail = {
      ...existant,
      description: payload.description ?? existant.description,
      motsCles: payload.motsCles ?? existant.motsCles,
    };
    brouillons.set(id, maj);
    return maj;
  },

  async motsClesFrequents() {
    await wait(300);
    return MOTS_CLES;
  },

  async envoyerAudio(id, { fichier, dureeSecondes }) {
  await wait(700);
  const existant = brouillons.get(id);
  if (!existant) throw introuvable();
  const audio = { url: URL.createObjectURL(fichier), dureeSecondes };
  brouillons.set(id, { ...existant, audio });
  return audio;
},
};