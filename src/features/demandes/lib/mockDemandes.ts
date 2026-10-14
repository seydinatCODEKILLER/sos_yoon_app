import type { ApiErreur } from "@/types/api.types";
import type {
  DemandeDetail,
  MotCleFrequent,
  SuiviDemande,
} from "../types/demande.types";
import type { DemandesApi } from "../api/demandeApi";

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));
/** MOCK : "ACCEPTEE" ou "AUCUN" pour simuler l'issue de la recherche */
/**
 * MOCK : issue de la recherche
 * - "ACCEPTEE" : un professionnel accepte après 25 s
 * - "AUCUN" : personne n'accepte, même après élargissement
 * - "ELARGISSEMENT" : personne au début, un professionnel accepte après « Élargir la recherche »
 */
/**
 * MOCK : issue de la recherche (change la valeur pour tester chaque cas)
 * - "ACCEPTEE" : un professionnel accepte après 25 s
 * - "AUCUN" : personne n'accepte, même après élargissement
 * - "ELARGISSEMENT" : personne au début, un professionnel accepte après « Élargir la recherche »
 */
type ScenarioSuivi = "ACCEPTEE" | "AUCUN" | "ELARGISSEMENT";
const SCENARIO_SUIVI = "ELARGISSEMENT" as ScenarioSuivi;
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

/** Date (ms) à laquelle l'utilisateur a élargi la recherche, par demande */
const elargissements = new Map<string, number>();

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

  async definirLocalisation(id, payload) {
    await wait();
    const existant = brouillons.get(id);
    if (!existant) throw introuvable();
    const libelle = payload.communeId
      ? payload.libelle
      : "Dakar-Plateau, Sénégal";
    brouillons.set(id, {
      ...existant,
      localisation: {
        libelle,
        rayonKm: 5,
        latitudeApprox: payload.latitude,
        longitudeApprox: payload.longitude,
      },
    });
    return {
      libelle,
      rayonKm: 5,
      secteur: "Présidence / Plateau",
      professionnelsDisponiblesDansZone: true,
    };
  },

  async envoyer(id) {
    await wait(800);
    const existant = brouillons.get(id);
    if (!existant) throw introuvable();
    const envoyee: DemandeDetail = {
      ...existant,
      statut: "EN_ATTENTE_ACCEPTATION",
      dateEnvoi: new Date().toISOString(),
    };
    brouillons.set(id, envoyee);
    return envoyee;
  },

  async communes() {
    await wait();
    return [
      { id: 1, nom: "Dakar-Plateau" },
      { id: 2, nom: "Médina" },
      { id: 3, nom: "Grand Dakar" },
      { id: 4, nom: "Parcelles Assainies" },
      { id: 5, nom: "Guédiawaye" },
      { id: 6, nom: "Pikine" },
      { id: 7, nom: "Rufisque" },
    ];
  },

  async suivi(id) {
    await wait(300);
    const d = brouillons.get(id);
    if (!d || !d.dateEnvoi) throw introuvable();

    const maintenant = Date.now();
    const debut = new Date(d.dateEnvoi).getTime();
    const elargi = elargissements.get(id);

    let etape: SuiviDemande["etape"];
    let nbNotifies: number;
    let acceptation: number | null = null;

    if (elargi === undefined) {
      const s = (maintenant - debut) / 1000;
      const issue = SCENARIO_SUIVI === "ACCEPTEE" ? "ACCEPTEE" : "AUCUN_PROFESSIONNEL";
      etape =
        s < 3 ? "ENREGISTREE" : s < 6 ? "ANALYSEE" : s < 25 ? "NOTIFIES" : issue;
      nbNotifies = s < 6 ? 0 : 6;
      if (etape === "ACCEPTEE") acceptation = debut + 25_000;
    } else {
      const r = (maintenant - elargi) / 1000;
      const issue = SCENARIO_SUIVI === "AUCUN" ? "AUCUN_PROFESSIONNEL" : "ACCEPTEE";
      etape = r < 10 ? "NOTIFIES" : issue;
      nbNotifies = 12;
      if (etape === "ACCEPTEE") acceptation = elargi + 10_000;
    }

    const accepte = etape === "ACCEPTEE";

    return {
      demandeId: id,
      reference: d.reference,
      statut:
        d.statut === "ANNULEE" ? "ANNULEE" : accepte ? "EN_COURS" : d.statut,
      etape,
      matiereLibelle: "constat d'huissier",
      metierPluriel: "huissiers",
      nbProfessionnelsNotifies: nbNotifies,
      zoneElargie: elargi !== undefined || (maintenant - debut) / 1000 >= 12,
      elargissementPossible: elargi === undefined,
      dateEnvoi: d.dateEnvoi,
      dateAcceptation: acceptation
        ? new Date(acceptation).toISOString()
        : null,
      professionnel: accepte
        ? {
            id: "pro-1",
            nomComplet: "Me Mamadou Diallo",
            metier: "huissier de justice",
            organisme: "Chambre Nationale des Huissiers de Justice",
            verifie: true,
            disponibleImmediatement: true,
            distanceKm: 1.2,
            communeLibelle: "Dakar-Plateau",
            delaiContactMinutes: 3,
            photoUrl: null,
            telephone: "221770000000",
          }
        : null,
    };
  },

  async elargir(id) {
    await wait(600);
    if (!brouillons.has(id)) throw introuvable();
    elargissements.set(id, Date.now());
  },

  async annuler(id) {
    await wait();
    const d = brouillons.get(id);
    if (!d) throw introuvable();
    brouillons.set(id, { ...d, statut: "ANNULEE" });
  },
};
