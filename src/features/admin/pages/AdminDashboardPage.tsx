import { useState } from "react";
import { MotionConfig, motion } from "motion/react";
import { Activity, BriefcaseBusiness, ChevronUp, FileText, RefreshCw, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { CarteStatAdmin } from "../components/CarteStatAdmin";
import { GraphiqueEvolutionAdmin } from "../components/GraphiqueEvolutionAdmin";
import { InscriptionsEnAttenteCarte } from "../components/InscriptionsEnAttente";
import { RepartitionMetiers } from "../components/RepartitionMetiers";
import { DASHBOARD_ADMIN_KEY, useEvolutionDemandes, useTableauDeBordAdmin } from "../hooks/useDashboardAdmin";
import type { VueEvolution } from "../types/dashboard.types";

function Hausse({ valeur }: { valeur: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-emerald-700">
      +{valeur} cette sem.
      <ChevronUp className="size-3" aria-hidden />
    </span>
  );
}

function heure(t: number): string {
  return t ? new Date(t).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
}

export function TableauDeBordAdminPage() {
  const qc = useQueryClient();
  const prenom = useAuthStore((s) => s.user?.prenom);
  const [vue, setVue] = useState<VueEvolution>("SEMAINE");
  const { data, dataUpdatedAt, isError, isFetching, refetch } = useTableauDeBordAdmin();
  const { data: evolution, isError: evolutionEnErreur, refetch: rechargerEvolution } = useEvolutionDemandes(vue);

  return (
    // reducedMotion="user" : les déplacements et fondus respectent le réglage système « réduire les animations »
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={conteneur}
        initial="cache"
        animate="visible"
        className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6"
      >
        <motion.header variants={apparition} className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Tableau de bord</h2>
            <p className="text-sm text-ink/60">
              Bonjour, {prenom ?? "Administrateur"} · Voici un aperçu de l'activité de la plateforme SOS Yoon.
            </p>
          </div>
          {data && (
            <button
              type="button"
              onClick={() => qc.invalidateQueries({ queryKey: DASHBOARD_ADMIN_KEY })}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink/60 outline-none hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-60"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} aria-hidden />
              Actualisé à {heure(dataUpdatedAt)}
            </button>
          )}
        </motion.header>

        {isError && !data ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            Impossible de charger le tableau de bord.{" "}
            <button onClick={() => refetch()} className="font-semibold underline">
              Réessayer
            </button>
          </p>
        ) : !data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-ink/5" />
              ))}
            </div>
            <div className="h-80 animate-pulse rounded-xl bg-ink/5" />
          </div>
        ) : (
          <>
            <motion.div variants={conteneur} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <CarteStatAdmin
                libelle="Utilisateurs"
                valeur={data.utilisateurs.total}
                teinte="bleu"
                icone={<Users className="size-4" />}
                vers="/admin/utilisateurs"
              >
                <Hausse valeur={data.utilisateurs.nouveauxCetteSemaine} />
              </CarteStatAdmin>

              <CarteStatAdmin
                libelle="Professionnels"
                valeur={data.professionnels.total}
                teinte="orange"
                icone={<BriefcaseBusiness className="size-4" />}
                vers="/admin/professionnels"
              >
                <span className="text-emerald-700">{data.professionnels.actifs} actifs</span>
                <span className="text-ink/40"> · </span>
                <span className="text-signal">{data.professionnels.enAttente} en attente</span>
              </CarteStatAdmin>

              <CarteStatAdmin
                libelle="Demandes"
                valeur={data.demandes.total}
                teinte="violet"
                icone={<FileText className="size-4" />}
                vers="/admin/demandes"
              >
                <Hausse valeur={data.demandes.nouvellesCetteSemaine} />
              </CarteStatAdmin>

              <CarteStatAdmin
                libelle="Demandes en cours"
                valeur={data.demandes.enCours}
                teinte="vert"
                icone={<Activity className="size-4" />}
                vers="/admin/demandes"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                  En traitement
                </span>
                {data.demandes.aQualifier > 0 && (
                  <span className="mt-1 block text-right text-amber-700">
                    {data.demandes.aQualifier} à qualifier
                  </span>
                )}
              </CarteStatAdmin>
            </motion.div>

            <motion.div variants={apparition}>
              <GraphiqueEvolutionAdmin
                evolution={evolution}
                vue={vue}
                onChangerVue={setVue}
                erreur={evolutionEnErreur}
                onReessayer={() => rechargerEvolution()}
              />
            </motion.div>

            <motion.div variants={conteneur} className="grid grid-cols-1 gap-4 lg:grid-cols-5">
              <div className="min-w-0 lg:col-span-2">
                <RepartitionMetiers repartition={data.repartitionMetiers} />
              </div>
              <div className="min-w-0 lg:col-span-3">
                <InscriptionsEnAttenteCarte
                  inscriptions={data.inscriptionsEnAttente}
                  totalEnAttente={data.professionnels.enAttente}
                  maintenant={dataUpdatedAt}
                />
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </MotionConfig>
  );
}