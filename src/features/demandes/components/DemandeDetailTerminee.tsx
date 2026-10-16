import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock,
  Landmark,
  MessageCircle,
  PhoneCall,
  X,
} from "lucide-react";
import type {
  PhaseDemande,
  SuiviDemande,
} from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { formatDateDemande, formatHeure } from "../lib/formatDateDemande";
import {
  lienAppel,
  lienWhatsApp,
  nomCourt,
} from "../lib/contactProfessionnel";
import { SuiviTimeline, type TimelineItem } from "./SuiviTimeline";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PHASES: PhaseDemande[] = [
  "ENVOYEE",
  "PROS_NOTIFIES",
  "ACCEPTEE",
  "CONTACT_ETABLI",
];

export function DemandeDetailTerminee({ suivi }: { suivi: SuiviDemande }) {
  const pro = suivi.professionnel;
  const annulee = suivi.statut === "ANNULEE";
  const titre = capitalise(suivi.matiereLibelle ?? "Demande d'aide");

  const jalon = (phase: PhaseDemande) =>
    suivi.jalons.find((j) => j.phase === phase);

  const textes: Record<PhaseDemande, { titre: string; description: string }> = {
    ENVOYEE: {
      titre: "Demande envoyée",
      description: "Reçue par le système central SOS Yoon",
    },
    PROS_NOTIFIES: {
      titre: "Professionnels notifiés",
      description: "Disponibilités vérifiées dans votre zone",
    },
    ACCEPTEE: {
      titre: "Demande acceptée",
      description: pro
        ? `Attribution confirmée avec ${nomCourt(pro.nomComplet)}`
        : "Attribution confirmée",
    },
    CONTACT_ETABLI: {
      titre: "Contact établi",
      description: "Échange direct réalisé",
    },
  };

  const items: TimelineItem[] = PHASES.map((phase) => {
    const j = jalon(phase);
    return {
      id: phase,
      titre: textes[phase].titre,
      description: textes[phase].description,
      status: j ? "done" : "pending",
      heure: j ? formatHeure(j.date) : undefined,
    };
  });

  const nbEtapes = items.filter((i) => i.status === "done").length;

  return (
    <div className="flex flex-1 flex-col">
      <Link
        to={demandeRoutes.liste}
        aria-label="Retour à mes demandes"
        className="-ml-2 inline-flex size-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-ink/5"
      >
        <ArrowLeft className="size-5" />
      </Link>

      {/* En-tête */}
      <section className="mt-2 rounded-xl border border-ink/8 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg leading-snug font-bold text-navy">{titre}</h2>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-ink/6 px-2.5 py-1 text-xs font-semibold text-ink/70">
            {annulee ? (
              <X className="size-3.5" aria-hidden />
            ) : (
              <Check className="size-3.5" aria-hidden />
            )}
            {annulee ? "Annulée" : "Terminée"}
          </span>
        </div>
        <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-ink/60">
          <Clock className="size-3.5" aria-hidden />
          {formatDateDemande(suivi.dateEnvoi)}
        </p>
      </section>

      {/* Parcours */}
      <section
        aria-label="Parcours de prise en charge"
        className="mt-4 rounded-xl border border-ink/8 bg-white p-3 shadow-sm"
      >
        <div className="flex items-center justify-between rounded-lg bg-ink/4 px-3 py-2">
          <h3 className="text-[13px] font-semibold text-ink">
            Parcours de prise en charge
          </h3>
          <span className="rounded-md bg-ink/8 px-2 py-0.5 text-xs font-medium text-ink/60">
            {nbEtapes === PHASES.length
              ? "Complet"
              : `${nbEtapes}/${PHASES.length} étapes`}
          </span>
        </div>
        <div className="mt-2">
          <SuiviTimeline items={items} />
        </div>
      </section>

      {/* Professionnel */}
      {pro && (
        <section
          aria-label="Professionnel"
          className="mt-4 rounded-xl border border-ink/8 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center text-navy"
            >
              <Landmark className="size-7" strokeWidth={1.5} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base leading-snug font-bold text-navy">
                  {pro.nomComplet}
                </p>
                {!annulee && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink/6 px-2 py-0.5 text-xs font-medium text-ink/70">
                    <span className="size-1.5 rounded-full bg-ink/40" />
                    Contact terminé
                  </span>
                )}
              </div>
              <p className="text-[13px] text-ink/60">
                {capitalise(pro.metier)} · {pro.communeLibelle}
              </p>
              {pro.ordre && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-ink/10 bg-ink/3 px-2.5 py-1 text-xs font-medium text-ink/70">
                  <BadgeCheck className="size-3.5" aria-hidden />
                  {pro.ordre}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {pro && (
        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <a
            href={lienAppel(pro.telephone)}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-paper transition hover:brightness-110"
          >
            <PhoneCall className="size-4" aria-hidden />
            Appeler
          </a>
          <a
            href={lienWhatsApp(pro.telephone, pro.nomComplet, suivi.reference)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-ink/8 text-sm font-semibold text-ink/80 transition-colors hover:bg-ink/12"
          >
            <MessageCircle className="size-4" aria-hidden />
            Message
          </a>
        </div>
      )}
    </div>
  );
}