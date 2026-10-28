import type { AbonnementApi } from "../api/abonnementApi";
import type {
  AbonnementDetail,
  Paiement,
  StatutAbonnement,
} from "../types/abonnement.types";
import { montantPourProfession } from "./abonnement";
import { TYPE_PROFESSION_MOCK } from "./mockProfil";

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const JOUR = 86_400_000;
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Mettre "EXPIRE" pour tester le compte suspendu */
let statut: StatutAbonnement = "ESSAI";

const debutEssai = Date.now() - 13 * JOUR;
const finEssai = debutEssai + 30 * JOUR;
let finPeriode: number | null = null;
let debutPeriode: number | null = null;
let paiements: Paiement[] = [];

function detail(): AbonnementDetail {
  const fin = statut === "ACTIF" ? (finPeriode ?? 0) : finEssai;
  return {
    statut,
    typeProfession: TYPE_PROFESSION_MOCK,
    debutEssai: iso(debutEssai),
    finEssai: iso(finEssai),
    debutPeriode: debutPeriode ? iso(debutPeriode) : null,
    finPeriode: finPeriode ? iso(finPeriode) : null,
    joursRestants: statut === "EXPIRE" ? 0 : Math.max(0, Math.ceil((fin - Date.now()) / JOUR)),
    montantMensuel: montantPourProfession(TYPE_PROFESSION_MOCK),
    devise: "XOF",
    suspendu: statut === "EXPIRE",
  };
}

export const mockAbonnementApi: AbonnementApi = {
  async detail() {
    await wait();
    return detail();
  },

  async paiements(page, taille) {
    await wait();
    const debut = page * taille;
    return {
      contenu: paiements.slice(debut, debut + taille),
      page,
      taille,
      totalElements: paiements.length,
      totalPages: Math.max(1, Math.ceil(paiements.length / taille)),
    };
  },

  async payer(payload) {
    await wait(1800); // simulation du passage chez l'opérateur
    const maintenant = Date.now();
    // Non échu : on prolonge à partir de la fin ; échu : à partir d'aujourd'hui
    const depart =
      statut === "ACTIF" ? (finPeriode ?? maintenant) : statut === "ESSAI" ? finEssai : maintenant;
    const fin = depart + 30 * JOUR;
    const montant = montantPourProfession(TYPE_PROFESSION_MOCK);
    const id = crypto.randomUUID();

    paiements = [
      {
        id,
        montant,
        moyenPaiement: payload.moyenPaiement,
        referenceExterne: `SIM-${id.slice(0, 6).toUpperCase()}`,
        statut: "REUSSI",
        datePaiement: new Date(maintenant).toISOString(),
        periodeDebut: iso(depart),
        periodeFin: iso(fin),
      },
      ...paiements,
    ];
    statut = "ACTIF";
    debutPeriode = debutPeriode ?? depart;
    finPeriode = fin;

    return {
      paiementId: id,
      statut: "REUSSI",
      montant,
      urlPaiement: null,
      instructions: null,
      periodeFin: iso(fin),
    };
  },
};