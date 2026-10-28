import type { ApiErreur } from "@/types/api.types";
import type { ProfessionnelsAdminApi } from "../api/professionnelsAdminApi";
import type {
  ChangementStatutProPayload,
  CompteursProfessionnels,
  DossierInscription,
  MotifAdmin,
  PageProfessionnels,
  ParamsProfessionnels,
  ProfessionnelAdmin,
  ProfessionnelAdminDetail,
  RefusDossierPayload,
  StatutAffichagePro,
  TypeDocument,
  TypeMotifPro,
  TypeProfession,
} from "../types/professionnels.types";
import { statutAffichage } from "./professionnels";

const attendre = (ms = 350) => new Promise((r) => setTimeout(r, ms));

interface Interne extends ProfessionnelAdmin {
  prenom: string;
  nom: string;
  matricule: string | null;
  zone: string;
  emailVerifie: boolean;
  dossier: DossierInscription;
}

type Seed = [string, string, TypeProfession, string, StatutAffichagePro, boolean, boolean];

const SEEDS: Seed[] = [
  ["Abdou", "Diop", "AVOCAT", "Droit pénal et des affaires", "VALIDE", true, false],
  ["Ousmane", "Fall", "JURISTE_CONSEIL", "Droit OHADA et fiscalité", "EN_ATTENTE", true, true],
  ["Fatou", "Ndiaye", "NOTAIRE", "Droit immobilier et successions", "VALIDE", false, false],
  ["Samba", "Sow", "HUISSIER", "Recouvrement et constats", "VALIDE", true, false],
  ["Aminata", "Ba", "AVOCAT", "Droit du travail et social", "EN_ATTENTE", true, true],
  ["Cheikh Tidiane", "Sy", "NOTAIRE", "Droit foncier", "SUSPENDU", false, false],
];

const PRENOMS = ["Awa", "Moussa", "Khady", "Ibrahima", "Mariama", "Ousmane", "Aïssatou", "Mamadou"];
const NOMS = ["Diallo", "Faye", "Gueye", "Sarr", "Mbaye", "Cissé", "Thiam", "Kane"];
const METIERS: TypeProfession[] = ["AVOCAT", "NOTAIRE", "HUISSIER", "JURISTE_CONSEIL"];
const SPECIALITES = ["Droit de la famille", "Droit commercial", "Droit pénal", "Droit foncier"];

const DOCS: Record<TypeDocument, { nom: string; taille: number }> = {
  CARTE_PRO: { nom: "Carte_professionnelle.pdf", taille: 900_000 },
  DIPLOME: { nom: "Master_II_Droit.pdf", taille: 1_200_000 },
  PIECE_IDENTITE: { nom: "CNI.pdf", taille: 800_000 },
};

function construire(i: number, seed: Seed | null): Interne {
  const [prenom, nom, type, spec, etat, dispo, nouveau] =
    seed ?? ([
      PRENOMS[i % PRENOMS.length],
      NOMS[(i * 3) % NOMS.length],
      METIERS[i % METIERS.length],
      SPECIALITES[i % SPECIALITES.length],
      i % 9 === 2 ? "EN_ATTENTE" : i % 13 === 4 ? "SUSPENDU" : i % 17 === 9 ? "REFUSE" : "VALIDE",
      i % 3 !== 0,
      false,
    ] as Seed);

  const statutCompte =
    etat === "VALIDE" ? "ACTIF" : etat === "SUSPENDU" ? "SUSPENDU_ADMIN" : "EN_ATTENTE_VALIDATION";
  const statutDossier = etat === "EN_ATTENTE" ? "EN_ATTENTE" : etat === "REFUSE" ? "REJETE" : "APPROUVE";
  const types: TypeDocument[] = type === "JURISTE_CONSEIL" ? ["DIPLOME", "PIECE_IDENTITE"] : ["CARTE_PRO"];
  const slug = `${prenom}.${nom}`.toLowerCase().replace(/[ïé ]/g, "");

  return {
    id: `pro-${i + 1}`,
    prenom,
    nom,
    nomComplet: type === "JURISTE_CONSEIL" ? `${prenom} ${nom}` : `Me ${prenom} ${nom}`,
    typeProfession: type,
    specialiteDominante: spec,
    telephone: `+221 77 ${String(300 + i).padStart(3, "0")} ${String(10 + i).padStart(2, "0")} ${String(20 + i).padStart(2, "0")}`,
    email: `${slug}@cabinet.sn`,
    emailVerifie: !(seed && seed[0] === "Aminata"), // pour tester l'erreur d'approbation
    matricule: type === "JURISTE_CONSEIL" ? null : `${10000 + i * 37}/SN`,
    zone: "Dakar et régions",
    disponible: etat === "SUSPENDU" ? false : dispo,
    statutCompte,
    statutDossier,
    nouveau,
    dateInscription: new Date(Date.UTC(2026, 9 - (i % 6), 1 + (i % 27))).toISOString(),
    dossier: {
      id: `dos-pro-${i + 1}`,
      reference: `PRO-2026-${String(400 + i).padStart(5, "0")}`,
      statut: statutDossier,
      dateSoumission: new Date(Date.UTC(2026, 8, 1 + (i % 27), 9)).toISOString(),
      nombreSoumissions: etat === "REFUSE" ? 2 : 1,
      declarationHonneurAcceptee: type === "JURISTE_CONSEIL",
      dateDeclarationHonneur: type === "JURISTE_CONSEIL" ? new Date(Date.UTC(2026, 8, 1 + (i % 27), 8, 55)).toISOString() : null,
      documents: types.map((t) => ({
        id: `doc-${i + 1}-${t}`,
        type: t,
        nomFichier: DOCS[t].nom,
        tailleOctets: DOCS[t].taille,
        statut: statutDossier === "EN_ATTENTE" ? "EN_ATTENTE" : statutDossier === "REJETE" ? "REJETE" : "ACCEPTE",
      })),
    },
  };
}

let pros: Interne[] = Array.from({ length: 48 }, (_, i) => construire(i, SEEDS[i] ?? null));

const MOTIFS: Record<TypeMotifPro, MotifAdmin[]> = {
  DESACTIVATION_PRO: [
    { id: "dp-1", libelle: "Manquement déontologique avéré" },
    { id: "dp-2", libelle: "Radiation ou suspension par l'Ordre" },
    { id: "dp-3", libelle: "Abonnement impayé" },
    { id: "dp-4", libelle: "Demande du professionnel" },
    { id: "dp-5", libelle: "Autre" },
  ],
  REACTIVATION_PRO: [
    { id: "rp-1", libelle: "Régularisation administrative validée" },
    { id: "rp-2", libelle: "Levée de suspension par l'Ordre" },
    { id: "rp-3", libelle: "Erreur de l'administration" },
    { id: "rp-4", libelle: "Autre" },
  ],
  REFUS_DOSSIER: [
    { id: "rf-1", libelle: "Pièce illisible ou expirée" },
    { id: "rf-2", libelle: "Pièce non conforme" },
    { id: "rf-3", libelle: "Informations incohérentes avec le dossier" },
    { id: "rf-4", libelle: "Autre" },
  ],
};

function erreur(code: string, message: string): ApiErreur {
  return { code, message, horodatage: new Date().toISOString() };
}

const trouver = (id: string) => {
  const p = pros.find((x) => x.id === id);
  if (!p) throw erreur("PROFESSIONNEL_INTROUVABLE", "Professionnel introuvable.");
  return p;
};
const parDossier = (dossierId: string) => {
  const p = pros.find((x) => x.dossier.id === dossierId);
  if (!p) throw erreur("DOSSIER_INTROUVABLE", "Dossier introuvable.");
  return p;
};
const maj = (id: string, patch: (p: Interne) => Interne) => {
  pros = pros.map((p) => (p.id === id ? patch(p) : p));
};

export const mockProfessionnelsAdminApi: ProfessionnelsAdminApi = {
  async lister({ q, statut, metier, page, taille }: ParamsProfessionnels): Promise<PageProfessionnels> {
    await attendre();
    const terme = q.trim().toLowerCase();
    const filtres = pros.filter((p) => {
      const etat = statutAffichage(p);
      if (statut === "EN_ATTENTE" && etat !== "EN_ATTENTE") return false;
      if (statut === "VALIDE" && etat !== "VALIDE") return false;
      if (statut === "SUSPENDU_OU_REJETE" && etat !== "SUSPENDU" && etat !== "REFUSE") return false;
      if (metier !== "TOUS" && p.typeProfession !== metier) return false;
      if (!terme) return true;
      return `${p.nomComplet} ${p.specialiteDominante} ${p.telephone} ${p.email ?? ""}`.toLowerCase().includes(terme);
    });
    const debut = page * taille;
    return {
      contenu: filtres.slice(debut, debut + taille),
      page,
      taille,
      totalElements: filtres.length,
      totalPages: Math.max(1, Math.ceil(filtres.length / taille)),
    };
  },

  async compteurs(): Promise<CompteursProfessionnels> {
    await attendre(200);
    const n = (e: StatutAffichagePro) => pros.filter((p) => statutAffichage(p) === e).length;
    return {
      total: pros.length,
      enAttente: n("EN_ATTENTE"),
      actifs: n("VALIDE"),
      suspendusOuRefuses: n("SUSPENDU") + n("REFUSE"),
      nouveauxCeMois: pros.filter((p) => p.nouveau).length + 2,
      refuses: n("REFUSE"),
      suspendus: n("SUSPENDU"),
    };
  },

  async detail(id: string): Promise<ProfessionnelAdminDetail> {
    await attendre(250);
    const p = trouver(id);
    return {
      id: p.id,
      prenom: p.prenom,
      nom: p.nom,
      typeProfession: p.typeProfession,
      telephone: p.telephone,
      email: p.email,
      emailVerifie: p.emailVerifie,
      matricule: p.matricule,
      specialites: [{ libelle: p.specialiteDominante, dominante: true }],
      zone: p.zone,
      dossierInscription: p.dossier,
      abonnement: p.statutCompte === "ACTIF" ? { statut: "ESSAI" } : null,
      statutCompte: p.statutCompte,
    };
  },

  async lienDocument(id: string, _documentId: string) {
    await attendre(200);
    trouver(id);
    return { url: "" }; // pas de fichier réel en démonstration
  },

  async motifs(type: TypeMotifPro) {
    await attendre(150);
    return MOTIFS[type];
  },

  async desactiver(id: string, payload: ChangementStatutProPayload) {
    await attendre();
    const p = trouver(id);
    if (p.statutCompte !== "ACTIF") throw erreur("COMPTE_NON_ACTIF", "Seul un compte actif peut être désactivé.");
    if (!MOTIFS.DESACTIVATION_PRO.some((m) => m.id === payload.motifId)) throw erreur("MOTIF_INVALIDE", "Motif invalide.");
    maj(id, (x) => ({ ...x, statutCompte: "SUSPENDU_ADMIN", disponible: false }));
    return { statutCompte: "SUSPENDU_ADMIN", dossiersEnCours: Number(id.split("-")[1]) % 3 };
  },

  async reactiver(id: string, payload: ChangementStatutProPayload) {
    await attendre();
    const p = trouver(id);
    if (p.statutCompte !== "SUSPENDU_ADMIN") throw erreur("COMPTE_NON_SUSPENDU", "Ce compte n'est pas suspendu.");
    if (!MOTIFS.REACTIVATION_PRO.some((m) => m.id === payload.motifId)) throw erreur("MOTIF_INVALIDE", "Motif invalide.");
    maj(id, (x) => ({ ...x, statutCompte: "ACTIF" }));
    return { statutCompte: "ACTIF" };
  },

  async approuver(dossierId: string, _commentaire?: string) {
    await attendre(500);
    const p = parDossier(dossierId);
    if (p.dossier.statut !== "EN_ATTENTE") throw erreur("DOSSIER_DEJA_TRAITE", "Ce dossier a déjà été traité.");
    if (!p.emailVerifie) throw erreur("EMAIL_NON_VERIFIE", "L'e-mail du professionnel n'est pas encore vérifié.");
    maj(p.id, (x) => ({
      ...x,
      statutCompte: "ACTIF",
      statutDossier: "APPROUVE",
      nouveau: false,
      dossier: {
        ...x.dossier,
        statut: "APPROUVE",
        documents: x.dossier.documents.map((d) => ({ ...d, statut: "ACCEPTE" as const })),
      },
    }));
    return { statut: "APPROUVE", statutCompte: "ACTIF", dateValidation: new Date().toISOString() };
  },

  async rejeter(dossierId: string, payload: RefusDossierPayload) {
    await attendre(500);
    const p = parDossier(dossierId);
    if (p.dossier.statut !== "EN_ATTENTE") throw erreur("DOSSIER_DEJA_TRAITE", "Ce dossier a déjà été traité.");
    if (!p.dossier.documents.some((d) => d.type === payload.pieceEnCause))
      throw erreur("PIECE_INVALIDE", "La pièce n'appartient pas au dossier.");
    if (!MOTIFS.REFUS_DOSSIER.some((m) => m.id === payload.motifId)) throw erreur("MOTIF_INVALIDE", "Motif invalide.");
    maj(p.id, (x) => ({
      ...x,
      statutDossier: "REJETE",
      nouveau: false,
      dossier: {
        ...x.dossier,
        statut: "REJETE",
        documents: x.dossier.documents.map((d) => ({
          ...d,
          statut: d.type === payload.pieceEnCause ? ("REJETE" as const) : d.statut,
        })),
      },
    }));
    return { statut: "REJETE", dateTraitement: new Date().toISOString() };
  },
};