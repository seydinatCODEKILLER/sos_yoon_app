import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  MessageCircle,
  PhoneCall,
  Plus,
  X,
} from "lucide-react";
import type { StatutDemande, SuiviDemande } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { formatDateComplete } from "../lib/formatDateDemande";
import { lienAppel, lienWhatsApp } from "../lib/contactProfessionnel";
import { TONS, type TonStatut } from "../lib/statutDemandeUi";
import { ProfessionnelCarte } from "./ProfessionnelCarte";
import { SuiviTimeline } from "./SuiviTimeline";
import { VotreDemande } from "./VotreDemande";
import { dateEnvoiSuivi, etapesVersTimeline } from "../lib/etapeSuivi";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Ce que dit l'écran selon la façon dont la demande s'est close */
const ISSUES: Partial<
  Record<
    StatutDemande,
    {
      titre: string;
      detail: string;
      ton: TonStatut;
      Icone: typeof Check;
    }
  >
> = {
  TERMINEE: {
    titre: "Demande terminée",
    detail: "Votre dossier est clos.",
    ton: "succes",
    Icone: Check,
  },
  ANNULEE: {
    titre: "Demande annulée",
    detail: "Cette demande a été annulée.",
    ton: "neutre",
    Icone: X,
  },
  EXPIRE_FALLBACK: {
    titre: "Demande sans réponse",
    detail: "Aucun professionnel n'a pu la prendre en charge.",
    ton: "alerte",
    Icone: Clock,
  },
  REFUSEE: {
    titre: "Demande refusée",
    detail: "Cette demande n'a pas pu être retenue.",
    ton: "neutre",
    Icone: X,
  },
};

interface DemandeDetailTermineeProps {
  suivi: SuiviDemande;
  demandeId: string;
}

/** Demande close (terminée, annulée ou restée sans réponse) : ce qui s'est passé et ce qui a été demandé */
export function DemandeDetailTerminee({
  suivi,
  demandeId,
}: DemandeDetailTermineeProps) {
  const pro = suivi.professionnelAffecte;
  const terminee = suivi.statut === "TERMINEE";
  const issue = ISSUES[suivi.statut] ?? ISSUES.ANNULEE!;
  const ton = TONS[issue.ton];
  const { Icone } = issue;

  const dateEnvoi = dateEnvoiSuivi(suivi.etapes);
  const dateCloture = suivi.etapes.find((e) => e.code === "CLOTURE")?.date;
  const items = etapesVersTimeline(suivi.etapes);

  return (
    <div className="flex flex-1 flex-col">
      <Link
        to={demandeRoutes.liste}
        aria-label="Retour à mes demandes"
        className="-ml-2 inline-flex size-10 items-center justify-center rounded-full text-navy outline-none transition-colors hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-signal/40"
      >
        <ArrowLeft className="size-5" />
      </Link>

      {/* Issue de la demande */}
      <header className="mt-2 flex flex-col items-center text-center">
        <span
          aria-hidden
          className={`grid size-16 place-items-center rounded-full ${ton.fond} ${ton.texte}`}
        >
          <Icone className="size-7" strokeWidth={2.5} />
        </span>
        <h2 className="mt-4 text-[26px] leading-tight font-bold text-navy">
          {issue.titre}
        </h2>
        <p className="mt-1.5 text-[15px] leading-snug text-ink/60">
          {issue.detail}
        </p>
      </header>

      {/* Identité de la demande */}
      <section
        aria-label="Résumé"
        className="mt-6 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm"
      >
        <p className="text-xs tabular-nums text-ink/50">{suivi.reference}</p>
        <p className="mt-0.5 text-lg leading-snug font-bold text-navy">
          {capitalise(suivi.titre ?? "Demande d'aide")}
        </p>
        <dl className="mt-3 space-y-1 text-[13px] text-ink/60">
          {dateEnvoi && (
            <div className="flex gap-1.5">
              <dt>Envoyée le</dt>
              <dd className="font-medium text-ink/80">
                {formatDateComplete(dateEnvoi)}
              </dd>
            </div>
          )}
          {dateCloture && (
            <div className="flex gap-1.5">
              <dt>Clôturée le</dt>
              <dd className="font-medium text-ink/80">
                {formatDateComplete(dateCloture)}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Professionnel et moyens de le recontacter */}
      {pro && (
        <section
          aria-label="Professionnel"
          className="mt-4 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm"
        >
          <ProfessionnelCarte pro={pro} />
          {pro.telephone && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={lienAppel(pro.telephone)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-paper transition hover:bg-navy/90"
              >
                <PhoneCall className="size-4" aria-hidden />
                Appeler
              </a>
              <a
                href={lienWhatsApp(pro.telephone, pro.nomComplet, suivi.reference)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white text-sm font-semibold text-navy transition-colors hover:bg-ink/3"
              >
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp
              </a>
            </div>
          )}
        </section>
      )}

      {/* Message ou audio envoyé, mots-clés, lieu */}
      <div className="mt-4">
        <VotreDemande demandeId={demandeId} />
      </div>

      {/* Déroulé : utile à relire, mais replié pour garder l'écran net */}
      <details className="group mt-4 rounded-2xl border border-ink/10 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-navy outline-none focus-visible:ring-2 focus-visible:ring-signal/40 [&::-webkit-details-marker]:hidden">
          Déroulé de la demande
          <ChevronDown
            aria-hidden
            className="size-5 text-ink/40 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-ink/8 p-2">
          <SuiviTimeline items={items} />
        </div>
      </details>

      <div className="mt-auto pt-8">
        <Link
          to={demandeRoutes.nouvelle}
          className={`inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition ${
            terminee
              ? "border border-ink/10 bg-white text-navy hover:bg-ink/3"
              : "bg-signal text-paper shadow-[0_6px_18px_rgba(249,97,13,0.3)] hover:brightness-105"
          }`}
        >
          <Plus className="size-4" aria-hidden />
          Faire une nouvelle demande
        </Link>
      </div>
    </div>
  );
}