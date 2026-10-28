import { useState } from "react";
import { motion } from "motion/react";
import { ChevronUp } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { CarteStatAdmin } from "../components/CarteStatAdmin";
import { GraphiqueEvolutionAdmin } from "../components/GraphiqueEvolutionAdmin";
import { InscriptionsEnAttenteCarte } from "../components/InscriptionsEnAttente";
import { RepartitionMetiers } from "../components/RepartitionMetiers";
import { useEvolutionDemandes, useTableauDeBordAdmin } from "../hooks/useDashboardAdmin";
import { formaterNombre } from "../lib/formatAdmin";
import type { VueEvolution } from "../types/dashboard.types";

function Hausse({ valeur }: { valeur: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-emerald-700">
      +{valeur} cette sem.
      <ChevronUp className="size-3" aria-hidden />
    </span>
  );
}

export function TableauDeBordAdminPage() {
  const prenom = useAuthStore((s) => s.user?.prenom);
  const [vue, setVue] = useState<VueEvolution>("SEMAINE");
  const { data, dataUpdatedAt, isError } = useTableauDeBordAdmin();
  const { data: evolution } = useEvolutionDemandes(vue);

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6"
    >
      <motion.header variants={apparition} className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-ink">Overview / Tableau de bord</h2>
        <p className="text-sm text-ink/60">
          Bonjour, {prenom ?? "Administrateur"} · Voici un aperçu complet de l'activité de la plateforme SOS Yoon.
        </p>
      </motion.header>

      {isError ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Impossible de charger le tableau de bord. Réessayez dans un instant.
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
            <CarteStatAdmin libelle="Utilisateurs" valeur={formaterNombre(data.utilisateurs.total)} teinte="bleu">
              <Hausse valeur={data.utilisateurs.nouveauxCetteSemaine} />
            </CarteStatAdmin>

            <CarteStatAdmin libelle="Professionnels" valeur={formaterNombre(data.professionnels.total)} teinte="orange">
              <span className="text-emerald-700">{data.professionnels.actifs} actifs</span>
              <span className="text-ink/40"> · </span>
              <span className="text-signal">{data.professionnels.enAttente} attente</span>
            </CarteStatAdmin>

            <CarteStatAdmin libelle="Demandes" valeur={formaterNombre(data.demandes.total)} teinte="violet">
              <Hausse valeur={data.demandes.nouvellesCetteSemaine} />
            </CarteStatAdmin>

            <CarteStatAdmin
              libelle="Demandes en cours"
              valeur={formaterNombre(data.demandes.enCours)}
              teinte="vert"
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
            <GraphiqueEvolutionAdmin evolution={evolution} vue={vue} onChangerVue={setVue} />
          </motion.div>

          <motion.div variants={conteneur} className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <RepartitionMetiers repartition={data.repartitionMetiers} />
            </div>
            <div className="lg:col-span-3">
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
  );
}