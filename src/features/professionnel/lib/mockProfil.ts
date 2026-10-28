import type { ProfilApi } from "../api/profilApi";
import type { ProfilPro, TypeProfession } from "../types/profil.types";

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

/** Changer en "JURISTE_CONSEIL" pour tester le tarif à 20 000 FCFA */
export const TYPE_PROFESSION_MOCK: TypeProfession = "AVOCAT";

let profil: ProfilPro = {
  id: "pro1",
  prenom: "Abdou",
  nom: "Ndiaye",
  nomComplet: "Me Abdou Ndiaye",
  titre: "Avocat à la Cour",
  typeProfession: TYPE_PROFESSION_MOCK,
  matricule: "ORDRE-SN-4819",
  adresseCabinet: "14, Avenue Léopold Sédar Senghor, Dakar Plateau",
  telephone: "+221771234567",
  email: "abdou@cabinet.sn",
  photoUrl: null,
  specialites: [
    { id: "s1", libelle: "Droit des affaires", dominante: true },
    { id: "s2", libelle: "Droit de la famille", dominante: false },
    { id: "s3", libelle: "Droit immobilier", dominante: false },
  ],
  zone: { region: "Dakar", latitude: 14.69, longitude: -17.44, rayonKm: 15 },
  disponible: true,
  statutCompte: "ACTIF",
  statistiques: { noteMoyenne: 4.8, nombreAvis: 48, tauxAcceptation: 92, delaiMoyenReponseSecondes: 840 },
};

export const mockProfilApi: ProfilApi = {
  async obtenir() {
    await wait();
    return profil;
  },

  async mettreAJour(payload) {
    await wait(500);
    profil = { ...profil, ...payload, nomComplet: `Me ${payload.prenom} ${payload.nom}` };
    return profil;
  },

  async envoyerPhoto(fichier) {
    await wait(600);
    const photoUrl = URL.createObjectURL(fichier);
    profil = { ...profil, photoUrl };
    return { photoUrl };
  },
};