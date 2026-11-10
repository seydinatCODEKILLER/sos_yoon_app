import { useEffect, useRef, type MouseEvent } from "react";
import {
  HAUTEUR_HEURE,
  cleJour,
  disposerJour,
  enteteJour,
  minutesDuJour,
  plageHoraire,
} from "../lib/agenda";
import type { RendezVous } from "../types/agenda.types";
import { BlocRendezVous } from "./BlocRendezVous";

const COLONNES = "grid-cols-[3.25rem_repeat(7,minmax(0,1fr))]";
/** Trait de séparation entre deux heures, sans élément DOM par ligne */
const LIGNES_HEURES = `repeating-linear-gradient(to bottom, transparent 0, transparent ${HAUTEUR_HEURE - 1}px, color-mix(in oklab, currentColor 9%, transparent) ${HAUTEUR_HEURE - 1}px, color-mix(in oklab, currentColor 9%, transparent) ${HAUTEUR_HEURE}px)`;

interface GrilleSemaineProps {
  jours: Date[];
  parJour: Record<string, RendezVous[]>;
  aujourdhui: string;
  maintenant: Date;
  onOuvrir: (rdv: RendezVous) => void;
  /** Clic sur un créneau libre : date AAAA-MM-JJ et heure HH:MM */
  onCreer: (date: string, heure: string) => void;
}

export function GrilleSemaine({
  jours,
  parJour,
  aujourdhui,
  maintenant,
  onOuvrir,
  onCreer,
}: GrilleSemaineProps) {
  const defilement = useRef<HTMLDivElement>(null);
  const tous = jours.flatMap((j) => parJour[cleJour(j)] ?? []);
  const { debut, fin } = plageHoraire(tous);
  const nbHeures = fin - debut;
  const debutGrilleMin = debut * 60;
  const heures = Array.from({ length: nbHeures }, (_, i) => debut + i);

  const semaineCourante = jours.some((j) => cleJour(j) === aujourdhui);
  const minutesMaintenant = minutesDuJour(maintenant);

  // À l'ouverture : on se place sur l'heure courante, ou sur le premier rendez-vous
  useEffect(() => {
    const cible = semaineCourante
      ? Math.floor(minutesDuJour(new Date()) / 60)
      : tous.length > 0
        ? Math.min(...tous.map((r) => new Date(r.debut).getHours()))
        : 8;
    if (defilement.current) {
      defilement.current.scrollTop = Math.max(0, (cible - 1 - debut) * HAUTEUR_HEURE);
    }
    // une seule fois par semaine affichée (la page remonte ce composant à chaque changement)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cliquerCreneau(e: MouseEvent<HTMLDivElement>, jour: Date) {
    if (e.target !== e.currentTarget) return;
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
    const demiHeures = Math.floor(((y / HAUTEUR_HEURE) * 60) / 30);
    const minutes = debutGrilleMin + demiHeures * 30;
    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    onCreer(cleJour(jour), `${hh}:${mm}`);
  }

  return (
    <div
      ref={defilement}
      className="max-h-[calc(100dvh-18rem)] min-h-104 overflow-auto rounded-xl border border-ink/10 bg-white"
    >
      <div className="min-w-208">
        {/* Jours : l'en-tête reste visible pendant le défilement vertical */}
        <div className={`sticky top-0 z-20 grid ${COLONNES} border-b border-ink/10 bg-white`}>
          <div />
          {jours.map((jour) => {
            const cle = cleJour(jour);
            const e = enteteJour(jour);
            const estAujourdhui = cle === aujourdhui;
            const nb = parJour[cle]?.length ?? 0;
            return (
              <div key={cle} className="flex flex-col items-center gap-0.5 border-l border-ink/8 py-2">
                <span
                  className={`text-xs font-medium ${estAujourdhui ? "text-signal" : "text-ink/55"}`}
                >
                  {e.court}
                </span>
                <span
                  className={`grid size-8 place-items-center rounded-full text-base font-bold tabular-nums ${
                    estAujourdhui ? "bg-signal text-white" : "text-ink"
                  }`}
                >
                  {e.numero}
                </span>
                <span className="text-[11px] text-ink/45">
                  {nb === 0 ? "Libre" : `${nb} rendez-vous`}
                </span>
              </div>
            );
          })}
        </div>

        <div className={`relative grid ${COLONNES}`}>
          {/* Axe des heures */}
          <div className="relative text-ink" style={{ height: nbHeures * HAUTEUR_HEURE }} aria-hidden>
            {heures.slice(1).map((h) => (
              <span
                key={h}
                className="absolute right-2 -translate-y-1/2 text-[11px] text-ink/45 tabular-nums"
                style={{ top: (h - debut) * HAUTEUR_HEURE }}
              >
                {h}h
              </span>
            ))}
          </div>

          {jours.map((jour) => {
            const cle = cleJour(jour);
            const estAujourdhui = cle === aujourdhui;
            const placements = disposerJour(parJour[cle] ?? []);
            const ligneMaintenant =
              estAujourdhui &&
              minutesMaintenant >= debutGrilleMin &&
              minutesMaintenant <= fin * 60;

            return (
              <div
                key={cle}
                onClick={(e) => cliquerCreneau(e, jour)}
                className={`relative cursor-cell border-l border-ink/8 text-ink ${
                  estAujourdhui ? "bg-signal/4" : ""
                }`}
                style={{ height: nbHeures * HAUTEUR_HEURE, backgroundImage: LIGNES_HEURES }}
              >
                {placements.map((p) => (
                  <BlocRendezVous
                    key={p.rdv.id}
                    placement={p}
                    debutGrilleMin={debutGrilleMin}
                    maintenant={maintenant}
                    onOuvrir={onOuvrir}
                  />
                ))}

                {ligneMaintenant && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-signal"
                    style={{
                      top: ((minutesMaintenant - debutGrilleMin) / 60) * HAUTEUR_HEURE - 1,
                    }}
                  >
                    <span className="absolute -top-0.75 -left-1 size-2 rounded-full bg-signal" />
                  </div>
                )}
              </div>
            );
          })}

          {tous.length === 0 && (
            <p className="pointer-events-none absolute inset-x-0 top-16 text-center text-sm text-ink/45">
              Aucun rendez-vous cette semaine. Cliquez sur un créneau pour en ajouter un.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}