import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { CarteDisponibilite } from "../components/CarteDisponibilite";
import {
  DialogRendezVous,
  type EtatDialogueRendezVous,
} from "../components/DialogRendezVous";
import { SemaineAgenda } from "../components/SemaineAgenda";
import { useAgenda } from "../hooks/useAgenda";
import {
  JOURS_AFFICHES,
  ajouterJours,
  cleJour,
  libelleSemaine,
  lundiDe,
} from "../lib/agenda";
import type { RendezVous, TypeRendezVous } from "../types/agenda.types";

type FiltreAgenda = "TOUS" | TypeRendezVous;

const FILTRES: { valeur: FiltreAgenda; libelle: string }[] = [
  { valeur: "TOUS", libelle: "Tous" },
  { valeur: "AUDIENCE", libelle: "Audiences" },
  { valeur: "CABINET", libelle: "Cabinet" },
  { valeur: "VISIO", libelle: "Visio" },
  { valeur: "APPEL", libelle: "Appels" },
];

export function AgendaPage() {
  // « Aujourd'hui » est figé au chargement de la page
  const [aujourdhui] = useState(() => new Date());
  const [lundi, setLundi] = useState(() => lundiDe(new Date()));
  const [filtre, setFiltre] = useState<FiltreAgenda>("TOUS");
  const [dialogue, setDialogue] = useState<EtatDialogueRendezVous | null>(null);

  const cleAujourdhui = cleJour(aujourdhui);
  const jours = useMemo(
    () => Array.from({ length: JOURS_AFFICHES }, (_, i) => ajouterJours(lundi, i)),
    [lundi],
  );

  const { data, dataUpdatedAt } = useAgenda(cleJour(jours[0]), cleJour(jours[jours.length - 1]));

  const compteur = (f: FiltreAgenda) =>
    f === "TOUS" ? (data?.length ?? 0) : (data?.filter((r) => r.type === f).length ?? 0);

  const parJour = useMemo(() => {
    const regroupe: Record<string, RendezVous[]> = {};
    for (const r of data ?? []) {
      if (filtre !== "TOUS" && r.type !== filtre) continue;
      (regroupe[cleJour(new Date(r.debut))] ??= []).push(r);
    }
    return regroupe;
  }, [data, filtre]);

  const semaineCourante = cleJour(lundi) === cleJour(lundiDe(aujourdhui));

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6"
    >
      <motion.header
        variants={apparition}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Agenda &amp; Rendez-vous juridiques
          </h2>
          <p className="max-w-xl text-sm text-ink/60">
            Gérez vos consultations, audiences et appels liés à vos dossiers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CarteDisponibilite />
          <Button
            type="button"
            onClick={() =>
              setDialogue({
                rdv: null,
                date: cleJour(semaineCourante ? aujourdhui : lundi),
              })
            }
            className="h-11 rounded-xl bg-signal px-5 font-semibold text-white hover:bg-signal/90"
          >
            <Plus className="size-4" aria-hidden />
            Nouveau RDV
          </Button>
        </div>
      </motion.header>

      {/* Barre de navigation et filtres */}
      <motion.div
        variants={apparition}
        className="flex flex-col gap-3 rounded-xl border border-ink/10 bg-linear-to-br from-white to-navy/5 p-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={semaineCourante}
            onClick={() => setLundi(lundiDe(aujourdhui))}
            className="h-9 text-xs font-semibold"
          >
            Aujourd'hui
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Semaine précédente"
            onClick={() => setLundi((l) => ajouterJours(l, -7))}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <p className="min-w-56 text-center text-sm font-bold text-ink" aria-live="polite">
            {libelleSemaine(lundi)}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Semaine suivante"
            onClick={() => setLundi((l) => ajouterJours(l, 7))}
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>

        <div className="flex max-w-full gap-1 overflow-x-auto" role="group" aria-label="Filtrer par type">
          {FILTRES.map((f) => {
            const actif = f.valeur === filtre;
            return (
              <Button
                key={f.valeur}
                type="button"
                size="sm"
                variant="ghost"
                aria-pressed={actif}
                onClick={() => setFiltre(f.valeur)}
                className={`h-8 shrink-0 gap-1.5 rounded-lg px-3 text-xs font-semibold ${
                  actif ? "bg-navy text-white hover:bg-navy/90 hover:text-white" : "text-ink/65"
                }`}
              >
                {f.libelle}
                <span className={actif ? "text-white/70" : "text-ink/45"}>({compteur(f.valeur)})</span>
              </Button>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={apparition}>
        {!data ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {jours.map((j) => (
              <div key={cleJour(j)} className="h-40 animate-pulse rounded-xl bg-ink/5 lg:h-72" />
            ))}
          </div>
        ) : (
          <SemaineAgenda
            key={cleJour(lundi)}
            jours={jours}
            parJour={parJour}
            aujourdhui={cleAujourdhui}
            maintenant={dataUpdatedAt}
            onOuvrir={(rdv) => setDialogue({ rdv, date: cleJour(new Date(rdv.debut)) })}
          />
        )}
      </motion.div>

      <DialogRendezVous etat={dialogue} onFermer={() => setDialogue(null)} />
    </motion.div>
  );
}