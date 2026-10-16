import type { ProfilParticulier, Region } from "../types/profil.types";
import type { ProfilApi } from "../api/profilApi";
import type { ApiErreur } from "@/types/api.types";
import type { Commune } from "@/features/demandes/types/demande.types";

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let profil: ProfilParticulier = {
  id: "user-1",
  prenom: "Aida",
  nom: "Fall",
  email: "aida.fall@gmail.com",
  telephone: "+221771234513",
  zoneHabituelle: "Pikine",
  photoUrl: null,
  dateInscription: "2026-09-12T09:00:00.000Z",
  regionId: 1,
  communeId: 6,
};

/** MOCK : le code actuel du compte de démonstration */
let codeSecret = "1234";
let tentativesRestantes = 3;

const REGIONS: Region[] = [
  { id: 1, nom: "Dakar" },
  { id: 2, nom: "Thiès" },
  { id: 3, nom: "Saint-Louis" },
  { id: 4, nom: "Diourbel" },
];

const COMMUNES_PAR_REGION: Record<number, Commune[]> = {
  1: [
    { id: 1, nom: "Dakar-Plateau" },
    { id: 2, nom: "Médina" },
    { id: 3, nom: "Grand Dakar" },
    { id: 4, nom: "Parcelles Assainies" },
    { id: 5, nom: "Guédiawaye" },
    { id: 6, nom: "Pikine (Pikine Ouest / Tally Boubess)" },
    { id: 7, nom: "Rufisque" },
    { id: 8, nom: "Almadies" },
    { id: 9, nom: "Fann / Point E / Amitié" },
  ],
  2: [
    { id: 21, nom: "Thiès Nord" },
    { id: 22, nom: "Thiès Est" },
    { id: 23, nom: "Mbour" },
    { id: 24, nom: "Tivaouane" },
  ],
  3: [
    { id: 31, nom: "Saint-Louis" },
    { id: 32, nom: "Richard-Toll" },
  ],
  4: [
    { id: 41, nom: "Diourbel" },
    { id: 42, nom: "Touba" },
  ],
};

export const mockProfilApi: ProfilApi = {
  async obtenir() {
    await wait();
    return profil;
  },

  async changerPhoto(photo) {
    await wait(800);
    // MOCK : l'aperçu local sert d'URL (perdue au rechargement de la page)
    const photoUrl = URL.createObjectURL(photo);
    profil = { ...profil, photoUrl };
    return { photoUrl };
  },

  async supprimerPhoto() {
    await wait(400);
    profil = { ...profil, photoUrl: null };
  },

  async changerCodeSecret({ codeActuel, nouveauCode }) {
    await wait(600);

    if (tentativesRestantes <= 0) {
      const erreur: ApiErreur = {
        code: "COMPTE_VERROUILLE",
        message: "Compte verrouillé.",
        horodatage: new Date().toISOString(),
      };
      throw erreur;
    }

    if (codeActuel !== codeSecret) {
      tentativesRestantes -= 1;
      const erreur: ApiErreur = {
        code: "CODE_SECRET_INCORRECT",
        message: "Code secret incorrect.",
        details: {
          essaisRestants: tentativesRestantes,
        } as unknown as ApiErreur["details"],
        horodatage: new Date().toISOString(),
      };
      throw erreur;
    }

    tentativesRestantes = 3;
    codeSecret = nouveauCode;
  },

  async modifier(payload) {
    await wait(600);
    const commune = payload.communeId
      ? Object.values(COMMUNES_PAR_REGION)
          .flat()
          .find((c) => c.id === payload.communeId)
      : undefined;

    profil = {
      ...profil,
      prenom: payload.prenom,
      nom: payload.nom,
      email: payload.email,
      regionId: payload.regionId,
      communeId: payload.communeId,
      zoneHabituelle: commune?.nom ?? null,
    };
    return profil;
  },

  async regions() {
    await wait(250);
    return REGIONS;
  },

  async communesDeRegion(regionId) {
    await wait(250);
    return COMMUNES_PAR_REGION[regionId] ?? [];
  },
};
