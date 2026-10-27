import { useState } from "react";
import { motion } from "motion/react";
import {
  CircleCheck,
  Clock,
  FileText,
  FolderOpen,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { CarteAbonnement } from "../components/CarteAbonnement";
import { CarteStat } from "../components/CarteStat";
import { DemandesUrgentes } from "../components/DemandesUrgentes";
import { GraphiqueEvolution } from "../components/GraphiqueEvolution";
import { useTableauDeBord } from "../hooks/useTableauDeBord";
import { formaterDuree } from "../lib/formatDashboard";
import type { Periode } from "../types/dashboard.types";
import { CarteDisponibilite } from "../components/CarteDisponibilite";

const PERIODES: {
  valeur: Periode;
  libelle: string;
  adjectif: string;
  description: string;
}[] = [
  {
    valeur: "7j",
    libelle: "7 jours",
    adjectif: "cette semaine",
    description: "7 derniers jours",
  },
  {
    valeur: "30j",
    libelle: "30 jours",
    adjectif: "ce mois",
    description: "30 derniers jours",
  },
];

export function TableauDeBordPage() {
  const user = useAuthStore((s) => s.user);
  const [periode, setPeriode] = useState<Periode>("7j");
  const { data, dataUpdatedAt } = useTableauDeBord(periode);

  const infoPeriode = PERIODES.find((p) => p.valeur === periode) ?? PERIODES[0];
  const nom = [user?.prenom, user?.nom].filter(Boolean).join(" ");

  const variation = data?.demandesRecues.variationPourcent ?? 0;
  const VariationIcone = variation >= 0 ? TrendingUp : TrendingDown;
  const totalPeriode =
    data?.evolution.reduce((somme, p) => somme + p.total, 0) ?? 0;

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6"
    >
      {/* En-tête */}
      <motion.header
        variants={apparition}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {nom ? `Bonjour, Maître ${nom}` : "Bonjour"}{" "}
            <span aria-hidden>👋</span>
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            Voici le résumé de votre activité et vos priorités juridiques du
            jour.
          </p>
        </div>

        <CarteDisponibilite />
      </motion.header>

      {/* Statistiques */}
      <motion.section
        variants={conteneur}
        aria-label="Statistiques"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <CarteStat
          titre="Demandes reçues"
          icone={FileText}
          teinte="bg-signal/15 text-signal"
          valeur={data ? String(data.demandesRecues.total) : null}
          pied={
            data && (
              <>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold ${
                    variation >= 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <VariationIcone className="size-3" aria-hidden />
                  {variation > 0 ? "+" : ""}
                  {variation} %
                </span>
                {infoPeriode.adjectif}
              </>
            )
          }
        />
        <CarteStat
          titre="Dossiers en cours"
          icone={FolderOpen}
          teinte="bg-sky-100 text-sky-700"
          valeur={data ? String(data.dossiersEnCours) : null}
          pied="Dossiers actifs"
        />
        <CarteStat
          titre="Temps de réponse"
          icone={Clock}
          teinte="bg-violet-100 text-violet-700"
          valeur={data ? formaterDuree(data.delaiMoyenReponseSecondes) : null}
          pied="Délai moyen de réponse"
        />
        <CarteStat
          titre="Taux d'acceptation"
          icone={CircleCheck}
          teinte="bg-emerald-100 text-emerald-700"
          valeur={data ? `${data.tauxAcceptation} %` : null}
          pied="Demandes acceptées"
        />
      </motion.section>

      {/* Évolution */}
      <motion.section variants={apparition}>
        <Card className={`${CARTE} py-0`}>
          <CardContent className="min-h-80 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="flex flex-wrap items-baseline gap-2 text-base font-semibold text-ink">
                  Évolution des demandes reçues
                  <span className="text-xs font-normal text-ink/50">
                    {infoPeriode.description}
                  </span>
                </h2>
                <p className="mt-1 max-w-md text-xs text-ink/60">
                  Activité des sollicitations d'assistance juridique reçues via
                  l'application SOS Yoon.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {data && (
                  <span className="inline-flex items-center gap-2 text-xs text-ink/70">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full bg-signal"
                    />
                    Cette période ({totalPeriode})
                  </span>
                )}
                <div
                  className="flex gap-1 rounded-lg bg-ink/5 p-1"
                  role="group"
                  aria-label="Période"
                >
                  {PERIODES.map((p) => (
                    <Button
                      key={p.valeur}
                      type="button"
                      size="sm"
                      variant="ghost"
                      aria-pressed={periode === p.valeur}
                      onClick={() => setPeriode(p.valeur)}
                      className={`h-7 rounded-md px-3 text-xs font-semibold ${
                        periode === p.valeur
                          ? "bg-navy text-white hover:bg-navy/90 hover:text-white"
                          : "text-ink/65"
                      }`}
                    >
                      {p.libelle}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              {data ? (
                data.evolution.length > 0 ? (
                  <GraphiqueEvolution
                    key={data.evolution.length}
                    points={data.evolution}
                  />
                ) : (
                  <p className="grid h-56 place-items-center text-sm text-ink/55">
                    Pas encore de données sur cette période.
                  </p>
                )
              ) : (
                <div className="h-56 animate-pulse rounded-xl bg-ink/5" />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Bas de page */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DemandesUrgentes
          demandes={data?.urgentes ?? null}
          total={data?.sollicitationsEnAttente ?? 0}
          maintenant={dataUpdatedAt}
        />
        <CarteAbonnement />
      </div>
    </motion.div>
  );
}
