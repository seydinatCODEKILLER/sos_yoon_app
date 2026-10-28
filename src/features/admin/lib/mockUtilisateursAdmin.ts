import type { ApiErreur } from "@/types/api.types";
import type {
  ChangementStatutPayload,
  CompteursUtilisateurs,
  MotifAdmin,
  PageUtilisateurs,
  ParamsUtilisateurs,
  TypeMotif,
  UtilisateurAdmin,
} from "../types/utilisateurs.types";
import type { UtilisateursAdminApi } from "../api/utilisateursAdminApi";
import { estActif } from "./utilisateurs";

const attendre = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const PRENOMS = [
  "Awa",
  "Moussa",
  "Fatou",
  "Ibrahima",
  "Mariama",
  "Cheikh",
  "Khady",
  "Ousmane",
  "Aïssatou",
  "Mamadou",
];
const NOMS = [
  "Diop",
  "Fall",
  "Ndiaye",
  "Sow",
  "Ba",
  "Gueye",
  "Sarr",
  "Diallo",
  "Faye",
  "Mbaye",
];

let utilisateurs: UtilisateurAdmin[] = Array.from({ length: 64 }, (_, i) => {
  const prenom = PRENOMS[i % PRENOMS.length];
  const nom = NOMS[(i * 3) % NOMS.length];
  return {
    id: `usr-${i + 1}`,
    prenom,
    nom,
    telephone: `+221 77 ${String(100 + i).padStart(3, "0")} ${String(10 + (i % 80)).padStart(2, "0")} ${String(20 + (i % 70)).padStart(2, "0")}`,
    email:
      i % 6 === 0
        ? null
        : `${prenom}.${nom}${i}@mail.sn`.toLowerCase().replace("ï", "i"),
    nombreDemandes: i % 7 === 0 ? 0 : (i * 5) % 9,
    dateInscription: new Date(
      Date.UTC(2026, 9 - (i % 9), 1 + (i % 27)),
    ).toISOString(),
    statutCompte: i % 11 === 5 ? "SUSPENDU_ADMIN" : "ACTIF",
  };
});

const MOTIFS: Record<TypeMotif, MotifAdmin[]> = {
  DESACTIVATION: [
    { id: "des-1", libelle: "Suspicion d'usage frauduleux ou usurpation" },
    { id: "des-2", libelle: "Comportement abusif envers un professionnel" },
    { id: "des-3", libelle: "Fausses informations d'identité" },
    { id: "des-4", libelle: "Demande de l'utilisateur" },
    { id: "des-5", libelle: "Autre" },
  ],
  REACTIVATION: [
    { id: "rea-1", libelle: "Régularisation du compte validée" },
    { id: "rea-2", libelle: "Erreur de l'administration" },
    { id: "rea-3", libelle: "Demande de l'utilisateur après vérification" },
    { id: "rea-4", libelle: "Autre" },
  ],
};

function erreur(code: string, message: string): ApiErreur {
  return { code, message, horodatage: new Date().toISOString() };
}

export const mockUtilisateursAdminApi: UtilisateursAdminApi = {
  async lister({
    q,
    statut,
    page,
    taille,
  }: ParamsUtilisateurs): Promise<PageUtilisateurs> {
    await attendre();
    const terme = q.trim().toLowerCase();
    const filtres = utilisateurs.filter((u) => {
      if (statut === "ACTIF" && !estActif(u.statutCompte)) return false;
      if (statut === "DESACTIVE" && estActif(u.statutCompte)) return false;
      if (!terme) return true;
      return `${u.prenom} ${u.nom} ${u.telephone} ${u.email ?? ""}`
        .toLowerCase()
        .includes(terme);
    });
    const debut = (page - 1) * taille;
    return {
      elements: filtres.slice(debut, debut + taille),
      total: filtres.length,
      page,
      taille,
    };
  },

  async compteurs(): Promise<CompteursUtilisateurs> {
    await attendre(200);
    const actifs = utilisateurs.filter((u) => estActif(u.statutCompte)).length;
    return {
      total: utilisateurs.length,
      actifs,
      desactives: utilisateurs.length - actifs,
      demandesInitiees: utilisateurs.reduce((n, u) => n + u.nombreDemandes, 0),
    };
  },

  async motifs(type: TypeMotif) {
    await attendre(150);
    return MOTIFS[type];
  },

  async desactiver(id: string, payload: ChangementStatutPayload) {
    await attendre();
    const u = utilisateurs.find((x) => x.id === id);
    if (!u) throw erreur("UTILISATEUR_INTROUVABLE", "Utilisateur introuvable.");
    if (!estActif(u.statutCompte))
      throw erreur("COMPTE_DEJA_DESACTIVE", "Ce compte est déjà désactivé.");
    if (!MOTIFS.DESACTIVATION.some((m) => m.id === payload.motifId))
      throw erreur("MOTIF_INVALIDE", "Motif invalide.");
    utilisateurs = utilisateurs.map((x) =>
      x.id === id ? { ...x, statutCompte: "SUSPENDU_ADMIN" } : x,
    );
    return {
      statutCompte: "SUSPENDU_ADMIN",
      dateDesactivation: new Date().toISOString(),
    };
  },

  async reactiver(id: string, payload: ChangementStatutPayload) {
    await attendre();
    const u = utilisateurs.find((x) => x.id === id);
    if (!u) throw erreur("UTILISATEUR_INTROUVABLE", "Utilisateur introuvable.");
    if (estActif(u.statutCompte))
      throw erreur("COMPTE_DEJA_ACTIF", "Ce compte est déjà actif.");
    if (!MOTIFS.REACTIVATION.some((m) => m.id === payload.motifId))
      throw erreur("MOTIF_INVALIDE", "Motif invalide.");
    utilisateurs = utilisateurs.map((x) =>
      x.id === id ? { ...x, statutCompte: "ACTIF" } : x,
    );
    return { statutCompte: "ACTIF" };
  },
};