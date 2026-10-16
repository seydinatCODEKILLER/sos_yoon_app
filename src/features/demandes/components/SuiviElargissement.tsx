import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Maximize, Search } from "lucide-react";
import type { PerimetreElargi, SuiviDemande } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { formatDateDemande, formatHeure } from "../lib/formatDateDemande";
import { initiales } from "../lib/contactProfessionnel";
import { AnnulerDemandeLien } from "./AnnulerDemandeLien";
import { SuiviTimeline, type TimelineItem } from "./SuiviTimeline";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const listeFr = new Intl.ListFormat("fr", {
  style: "long",
  type: "conjunction",
});

interface SuiviElargissementProps {
  suivi: SuiviDemande;
  perimetre: PerimetreElargi;
}

export function SuiviElargissement({
  suivi,
  perimetre,
}: SuiviElargissementProps) {
  const titre = capitalise(suivi.matiereLibelle ?? "Demande d'aide");

  const items: TimelineItem[] = [
    {
      id: "envoyee",
      titre: "Demande envoyée",
      status: "done",
      heure: formatHeure(suivi.dateEnvoi),
    },
    {
      id: "elargissement",
      titre: "Élargissement du périmètre",
      status: "current",
      heure: "En cours…",
    },
    {
      id: "acceptee",
      titre: "Demande acceptée",
      status: "pending",
      heure: "En attente",
    },
    {
      id: "contact",
      titre: "Contact établi",
      status: "pending",
      heure: "En attente",
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Link
        to={demandeRoutes.liste}
        aria-label="Retour à mes demandes"
        className="-ml-2 inline-flex size-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-ink/5"
      >
        <ArrowLeft className="size-5" />
      </Link>

      {/* Bandeau d'information */}
      <div
        role="status"
        className="mt-2 flex gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-3.5"
      >
        <Maximize className="mt-0.5 size-5 shrink-0 text-sky-600" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-sky-900">
            Aucune réponse à proximité
          </p>
          <p className="text-[13px] leading-snug text-sky-800/80">
            Nous élargissons automatiquement la recherche aux zones voisines.
          </p>
        </div>
      </div>

      {/* En-tête de la demande */}
      <section className="mt-4 rounded-2xl border border-ink/8 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg leading-snug font-bold text-navy">{titre}</h2>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink/8 px-2.5 py-1 text-xs font-semibold text-ink/80">
            <Search className="size-3.5" aria-hidden />
            Recherche en cours
          </span>
        </div>
        <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-ink/60">
          <Clock className="size-3.5" aria-hidden />
          {formatDateDemande(suivi.dateEnvoi)}
        </p>
      </section>

      {/* Progression */}
      <section aria-labelledby="titre-progression" className="mt-6">
        <h3
          id="titre-progression"
          className="mb-2 px-3 text-xs font-bold tracking-wider text-ink/50 uppercase"
        >
          Progression
        </h3>
        <SuiviTimeline items={items} surlignerCourant={false} />
      </section>

      {/* Professionnels contactés */}
      {suivi.professionnelsContactes.length > 0 && (
        <section aria-labelledby="titre-contactes" className="mt-6">
          <h3
            id="titre-contactes"
            className="text-base font-bold text-navy"
          >
            Professionnels contactés ({perimetre.zone})
          </h3>
          <p className="mt-0.5 text-[13px] text-ink/60">
            Rayon étendu à {listeFr.format(perimetre.secteurs)}.
          </p>

          <ul className="mt-3 space-y-2">
            {suivi.professionnelsContactes.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-ink/8 bg-ink/3 px-3 py-2.5"
              >
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/8 text-xs font-semibold text-navy"
                >
                  {initiales(p.nom)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                  {p.nom}
                </span>
                <span className="shrink-0 rounded-full border border-ink/15 bg-white px-2.5 py-0.5 text-xs text-ink/70">
                  {p.statut === "VU" ? "Demande vue" : "Notifié"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-auto pt-6">
        <AnnulerDemandeLien demandeId={suivi.demandeId} />
      </div>
    </div>
  );
}