import { CalendarPlus, MapPin } from "lucide-react";
import {
  TYPES_RDV_CONFIG,
  cleJour,
  enteteJour,
  heure,
  libelleDuree,
} from "../lib/agenda";
import type { RendezVous } from "../types/agenda.types";

interface ListeJourProps {
  jours: Date[];
  parJour: Record<string, RendezVous[]>;
  aujourdhui: string;
  jourActif: string;
  onChoisir: (cle: string) => void;
  maintenant: Date;
  onOuvrir: (rdv: RendezVous) => void;
  onCreer: (date: string) => void;
}

function Ligne({
  rdv,
  maintenant,
  onOuvrir,
}: {
  rdv: RendezVous;
  maintenant: Date;
  onOuvrir: (rdv: RendezVous) => void;
}) {
  const cfg = TYPES_RDV_CONFIG[rdv.type];
  const Icone = cfg.icone;
  const termine = new Date(rdv.fin).getTime() < maintenant.getTime();

  return (
    <li className="flex gap-3">
      <div className="w-12 shrink-0 pt-3 text-right tabular-nums">
        <p className="text-sm font-bold text-ink">{heure(rdv.debut)}</p>
        <p className="text-[11px] text-ink/45">{heure(rdv.fin)}</p>
      </div>
      <button
        type="button"
        onClick={() => onOuvrir(rdv)}
        className={`relative min-w-0 flex-1 overflow-hidden rounded-xl p-3 pl-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-signal ${cfg.bloc} ${
          termine ? "opacity-60" : ""
        }`}
      >
        <span aria-hidden className={`absolute inset-y-0 left-0 w-1.5 ${cfg.barre}`} />
        <span className="flex items-start justify-between gap-2">
          <span className="text-sm leading-snug font-semibold">{rdv.titre}</span>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${cfg.badge}`}
          >
            <Icone className="size-3" aria-hidden />
            {cfg.libelle}
          </span>
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs opacity-70">
          <span>{libelleDuree(rdv.debut, rdv.fin)}</span>
          {rdv.lieu && (
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="size-3 shrink-0" aria-hidden />
              <span className="truncate">{rdv.lieu}</span>
            </span>
          )}
          {rdv.dossierReference && <span className="font-mono">{rdv.dossierReference}</span>}
        </span>
      </button>
    </li>
  );
}

/** Petit écran : bandeau des jours de la semaine, puis les rendez-vous du jour choisi */
export function ListeJour({
  jours,
  parJour,
  aujourdhui,
  jourActif,
  onChoisir,
  maintenant,
  onOuvrir,
  onCreer,
}: ListeJourProps) {
  const rdvs = parJour[jourActif] ?? [];
  const jour = jours.find((j) => cleJour(j) === jourActif) ?? jours[0];

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Jours de la semaine" className="grid grid-cols-7 gap-1">
        {jours.map((j) => {
          const cle = cleJour(j);
          const e = enteteJour(j);
          const actif = cle === jourActif;
          const estAujourdhui = cle === aujourdhui;
          const nb = parJour[cle]?.length ?? 0;
          return (
            <button
              key={cle}
              type="button"
              role="tab"
              aria-selected={actif}
              aria-label={`${e.long}${nb ? `, ${nb} rendez-vous` : ""}`}
              onClick={() => onChoisir(cle)}
              className={`flex flex-col items-center gap-0.5 rounded-xl py-2 outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                actif ? "bg-navy text-white" : "bg-white text-ink ring-1 ring-ink/10"
              }`}
            >
              <span
                className={`text-[11px] font-medium ${
                  actif ? "text-white/70" : estAujourdhui ? "text-signal" : "text-ink/55"
                }`}
              >
                {e.court}
              </span>
              <span className="text-base font-bold tabular-nums">{e.numero}</span>
              <span
                aria-hidden
                className={`size-1.5 rounded-full ${
                  nb === 0 ? "bg-transparent" : actif ? "bg-white" : "bg-signal"
                }`}
              />
            </button>
          );
        })}
      </div>

      <section aria-label={enteteJour(jour).long} className="space-y-3">
        <h3 className="text-sm font-bold text-ink first-letter:uppercase">
          {enteteJour(jour).long}
          {jourActif === aujourdhui && <span className="font-medium text-signal"> · Aujourd'hui</span>}
        </h3>
        {rdvs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink/15 bg-white/60 px-4 py-8 text-center">
            <p className="text-sm text-ink/60">Rien de prévu ce jour-là.</p>
            <button
              type="button"
              onClick={() => onCreer(jourActif)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 text-sm font-semibold text-ink outline-none hover:bg-ink/3 focus-visible:ring-2 focus-visible:ring-signal"
            >
              <CalendarPlus className="size-4" aria-hidden />
              Ajouter un rendez-vous
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {rdvs.map((rdv) => (
              <Ligne key={rdv.id} rdv={rdv} maintenant={maintenant} onOuvrir={onOuvrir} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}