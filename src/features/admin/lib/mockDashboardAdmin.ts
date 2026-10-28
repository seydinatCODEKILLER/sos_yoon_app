import type { DashboardAdminApi } from "../api/dashboardAdminApi";
import type { EvolutionDemandes, TableauDeBordAdmin, VueEvolution } from "../types/dashboard.types";

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const JOUR = 86_400_000;
const il = (jours: number) => new Date(Date.now() - jours * JOUR).toISOString();

const tableau: TableauDeBordAdmin = {
  utilisateurs: { total: 1248, nouveauxCetteSemaine: 12 },
  professionnels: { total: 48, actifs: 42, enAttente: 6 },
  demandes: { total: 356, nouvellesCetteSemaine: 24, enCours: 18, aQualifier: 2 },
  inscriptionsEnAttente: [
    {
      dossierId: "d1",
      professionnelId: "p1",
      nomComplet: "Me Abdou Diop",
      typeProfession: "AVOCAT",
      dateSoumission: il(5),
    },
    {
      dossierId: "d2",
      professionnelId: "p2",
      nomComplet: "Mme Fatou Ndiaye",
      typeProfession: "NOTAIRE",
      dateSoumission: il(3),
    },
    {
      dossierId: "d3",
      professionnelId: "p3",
      nomComplet: "M. Ousmane Fall",
      typeProfession: "JURISTE_CONSEIL",
      dateSoumission: il(1),
    },
  ],
  repartitionMetiers: [
    { typeProfession: "AVOCAT", nombre: 22 },
    { typeProfession: "HUISSIER", nombre: 10 },
    { typeProfession: "JURISTE_CONSEIL", nombre: 9 },
    { typeProfession: "NOTAIRE", nombre: 7 },
  ],
};

const MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

const SERIES: Record<VueEvolution, { cetteAnnee: number[]; anneePassee: number[] }> = {
  JOUR: {
    cetteAnnee: [8, 11, 9, 14, 12, 7, 6, 13, 16, 12, 15, 18, 14, 17],
    anneePassee: [6, 9, 12, 8, 10, 9, 5, 7, 11, 10, 9, 12, 13, 11],
  },
  SEMAINE: {
    cetteAnnee: [20, 24, 22, 28, 26, 31, 29, 36, 33, 38, 35, 41],
    anneePassee: [18, 26, 21, 23, 30, 24, 27, 22, 34, 29, 25, 32],
  },
  MOIS: {
    cetteAnnee: [60, 54, 66, 72, 98, 84, 90, 86, 94, 101, 96, 110],
    anneePassee: [48, 70, 58, 74, 52, 40, 120, 78, 66, 82, 74, 88],
  },
  METIER: {
    cetteAnnee: [162, 74, 66, 54],
    anneePassee: [140, 66, 52, 48],
  },
};

function libelles(vue: VueEvolution): string[] {
  const maintenant = Date.now();
  switch (vue) {
    case "JOUR":
      return Array.from({ length: 14 }, (_, i) =>
        new Date(maintenant - (13 - i) * JOUR).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      );
    case "SEMAINE":
      return Array.from({ length: 12 }, (_, i) => `S${i + 1}`);
    case "MOIS":
      return MOIS.slice(0, new Date().getMonth() + 1);
    case "METIER":
      return ["Avocats", "Huissiers", "Juristes", "Notaires"];
  }
}

export const mockDashboardAdminApi: DashboardAdminApi = {
  async tableauDeBord() {
    await wait();
    return tableau;
  },

  async evolution(vue): Promise<EvolutionDemandes> {
    await wait(300);
    const noms = libelles(vue);
    const { cetteAnnee, anneePassee } = SERIES[vue];
    return {
      vue,
      libelles: noms,
      cetteAnnee: cetteAnnee.slice(0, noms.length),
      anneePassee: anneePassee.slice(0, noms.length),
    };
  },
};