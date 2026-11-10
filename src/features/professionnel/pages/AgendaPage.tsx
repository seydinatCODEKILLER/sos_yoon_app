import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { CarteDisponibilite } from "../components/CarteDisponibilite";
import { DialogRendezVous, type EtatDialogueRendezVous } from "../components/DialogRendezVous";
import { GrilleSemaine } from "../components/GrilleSemaine";
import { ListeJour } from "../components/ListeJour";
import { useAgenda } from "../hooks/useAgenda";
import { useMaintenant } from "../hooks/useMaintenant";
import {
  JOURS_AFFICHES,
  TYPES_RDV_CONFIG,
  ajouterJours,
  cleJour,
  enteteJour,
  heure,
  libelleSemaine,
  lundiDe,
  prochainRendezVous,
} from "../lib/agenda";
import { TYPES_RDV } from "../schema/rendezVous.schema";
import type { RendezVous, TypeRendezVous } from "../types/agenda.types";

type FiltreAgenda = "TOUS" | TypeRendezVous;

const FILTRES: { valeur: FiltreAgenda; libelle: string }[] = [
  { valeur: "TOUS", libelle: "Tous" },
  ...TYPES_RDV.map((t) => ({ valeur: t, libelle: TYPES_RDV_CONFIG[t].libelle })),
];

export function AgendaPage() {
  const maintenant = useMaintenant();
  const [lundi, setLundi] = useState(() => lundiDe(new Date()));
  const [filtre, setFiltre] = useState<FiltreAgenda>("TOUS");
  const [jourMobile, setJourMobile] = useState(() => cleJour(new Date()));
  const [dialogue, setDialogue] = useState<EtatDialogueRendezVous | null>(null);

  const cleAujourdhui = cleJour(maintenant);
  const jours = useMemo(
    () => Array.from({ length: JOURS_AFFICHES }, (_, i) => ajouterJours(lundi, i)),
    [lundi],
  );
  const cles = useMemo(() => new Set(jours.map(cleJour)), [jours]);
  const semaineCourante = cleJour(lundi) === cleJour(lundiDe(maintenant));

  // Le backend découpe les journées en UTC : on lit un jour de marge de chaque côté
  // et on range les rendez-vous par jour local, pour qu'aucun ne disparaisse à minuit
  const { data, isError, refetch } = useAgenda(
    cleJour(ajouterJours(lundi, -1)),
    cleJour(ajouterJours(lundi, JOURS_AFFICHES)),
  );

  const semaine = useMemo(
    () => (data ?? []).filter((r) => cles.has(cleJour(new Date(r.debut)))),
    [data, cles],
  );

  const parJour = useMemo(() => {
    const regroupe: Record<string, RendezVous[]> = {};
    for (const r of semaine) {
      if (filtre !== "TOUS" && r.type !== filtre) continue;
      (regroupe[cleJour(new Date(r.debut))] ??= []).push(r);
    }
    return regroupe;
  }, [semaine, filtre]);

  const compteur = (f: FiltreAgenda) =>
    f === "TOUS" ? semaine.length : semaine.filter((r) => r.type === f).length;

  // Jour affiché sur petit écran : celui choisi s'il est dans la semaine, sinon aujourd'hui ou le lundi
  const jourActif = cles.has(jourMobile)
    ? jourMobile
    : semaineCourante
      ? cleAujourdhui
      : cleJour(jours[0]);

  const prochain = prochainRendezVous(data ?? [], maintenant);

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
          <h2 className="text-2xl font-bold tracking-tight text-ink">Agenda</h2>
          <p className="max-w-xl text-sm text-ink/60">
            {prochain ? (
              <>
                Prochain rendez-vous : <strong className="text-ink">{prochain.titre}</strong>,{" "}
                {enteteJour(new Date(prochain.debut)).long} à {heure(prochain.debut)}.
              </>
            ) : (
              "Gérez vos consultations, audiences et appels liés à vos dossiers."
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CarteDisponibilite />
          <Button
            type="button"
            onClick={() =>
              setDialogue({
                rdv: null,
                date: semaineCourante ? cleAujourdhui : cleJour(lundi),
              })
            }
            className="h-11 rounded-xl bg-signal px-5 font-semibold text-white hover:bg-signal/90"
          >
            <Plus className="size-4" aria-hidden />
            Nouveau RDV
          </Button>
        </div>
      </motion.header>

      {/* Navigation entre les semaines et filtres par type */}
      <motion.div
        variants={apparition}
        className="flex flex-col gap-3 rounded-xl border border-ink/10 bg-white p-2 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={semaineCourante}
            onClick={() => {
              setLundi(lundiDe(new Date()));
              setJourMobile(cleJour(new Date()));
            }}
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Semaine suivante"
            onClick={() => setLundi((l) => ajouterJours(l, 7))}
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
          <p className="ml-1 text-sm font-bold text-ink" aria-live="polite">
            {libelleSemaine(lundi)}
          </p>
        </div>

        <div
          className="flex max-w-full gap-1 overflow-x-auto"
          role="group"
          aria-label="Filtrer par type"
        >
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
                {f.valeur !== "TOUS" && (
                  <span
                    aria-hidden
                    className={`size-2 rounded-full ${TYPES_RDV_CONFIG[f.valeur].point}`}
                  />
                )}
                {f.libelle}
                <span className={actif ? "text-white/70" : "text-ink/45"}>
                  ({compteur(f.valeur)})
                </span>
              </Button>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={apparition}>
        {isError && !data ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-xl bg-red-50 p-6 text-center"
          >
            <p className="text-sm font-semibold text-red-700">Impossible de charger votre agenda.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Réessayer
            </Button>
          </div>
        ) : !data ? (
          <div className="h-104 animate-pulse rounded-xl bg-ink/5" />
        ) : (
          <>
            <div className="hidden lg:block">
              <GrilleSemaine
                key={cleJour(lundi)}
                jours={jours}
                parJour={parJour}
                aujourdhui={cleAujourdhui}
                maintenant={maintenant}
                onOuvrir={(rdv) => setDialogue({ rdv, date: cleJour(new Date(rdv.debut)) })}
                onCreer={(date, hhmm) => setDialogue({ rdv: null, date, heure: hhmm })}
              />
            </div>
            <div className="lg:hidden">
              <ListeJour
                jours={jours}
                parJour={parJour}
                aujourdhui={cleAujourdhui}
                jourActif={jourActif}
                onChoisir={setJourMobile}
                maintenant={maintenant}
                onOuvrir={(rdv) => setDialogue({ rdv, date: cleJour(new Date(rdv.debut)) })}
                onCreer={(date) => setDialogue({ rdv: null, date })}
              />
            </div>
          </>
        )}
      </motion.div>

      <DialogRendezVous etat={dialogue} onFermer={() => setDialogue(null)} />
    </motion.div>
  );
}