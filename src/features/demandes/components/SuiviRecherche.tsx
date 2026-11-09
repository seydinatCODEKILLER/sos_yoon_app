import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Clock, Hourglass, Search } from "lucide-react";
import type { SuiviDemande } from "../types/demande.types";
import { formatDuree } from "../lib/formatDuration";
import { demandeRoutes } from "../lib/demandeRoutes";
import { useSecondesEcoulees } from "../hooks/useSecondesEcoulees";
import { useSecondesRestantes } from "../hooks/useSecondesRestantes";
import { SuiviTimeline } from "./SuiviTimeline";
import { AnnulerDemandeLien } from "./AnnulerDemandeLien";
import { ReorienterDemandeLien } from "./ReorienterDemandeLien";
import { ProfessionnelCarte } from "./ProfessionnelCarte";
import { dateEnvoiSuivi, etapesVersTimeline } from "../lib/etapeSuivi";

function SearchOrb() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative grid size-52 place-items-center">
      <motion.span
        className="absolute inset-0 rounded-full bg-signal/10"
        animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="absolute inset-8 rounded-full bg-signal/15" />
      <span className="relative z-10 grid size-20 place-items-center rounded-full bg-[radial-gradient(circle_at_50%_30%,#ff7d22,#e8580a)] text-paper shadow-[0_10px_30px_rgba(249,97,13,0.4)]">
        <Search className="size-8" />
      </span>
      {/* Point qui tourne autour de l'orbe */}
      <motion.span
        className="absolute inset-16"
        initial={{ rotate: 45 }}
        animate={reduce ? { rotate: 45 } : { rotate: 405 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rounded-full bg-white ring-2 ring-signal/30" />
      </motion.span>
    </div>
  );
}

/** Le professionnel sollicité dispose d'un délai pour répondre */
function ReponseAttendue({ expireLe }: { expireLe: string | null | undefined }) {
  const restantes = useSecondesRestantes(expireLe);
  if (restantes === null) return null;
  return (
    <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 tabular-nums">
      <Hourglass className="size-3.5" aria-hidden />
      {restantes > 0
        ? `Réponse attendue sous ${formatDuree(restantes)}`
        : "Délai écoulé, passage au suivant…"}
    </p>
  );
}

interface SuiviRechercheProps {
  demandeId: string;
  suivi: SuiviDemande;
}

/**
 * Demande en cours de traitement :
 * - analyse de la situation (aucun professionnel sollicité pour l'instant) ;
 * - ou « professionnel identifié » : un professionnel est sollicité, d'autres attendent en réserve.
 */
export function SuiviRecherche({ demandeId, suivi }: SuiviRechercheProps) {
  const secondes = useSecondesEcoulees(dateEnvoiSuivi(suivi.etapes));
  const sollicite = suivi.sollicitationEnCours;
  const enReserve = suivi.fileReserve.length;
  const enTriage = suivi.statut === "EN_ATTENTE_TRIAGE";

  const items = etapesVersTimeline(suivi.etapes, {
    codes: [
      "DEMANDE_ENVOYEE",
      "SITUATION_ANALYSEE",
      "PROFESSIONNEL_IDENTIFIE",
      "DEMANDE_ACCEPTEE",
    ],
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center text-center">
        <SearchOrb />

        <h2 className="mt-2 text-[28px] leading-tight font-bold text-navy">
          {sollicite ? "Professionnel identifié" : "Recherche en cours"}
        </h2>
        <p className="mt-2 text-[15px] leading-snug text-ink/60">
          {sollicite
            ? "Votre demande lui a été transmise, nous attendons sa réponse."
            : enTriage
              ? "Notre équipe examine votre demande."
              : "Nous analysons votre situation pour trouver le bon professionnel."}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink/6 px-3 py-1.5 text-xs font-medium text-ink/70 tabular-nums">
          <Clock className="size-3.5" aria-hidden />
          depuis {formatDuree(secondes)}
        </span>
      </div>

      {sollicite?.professionnel && (
        <section
          aria-label="Professionnel sollicité"
          className="mt-6 rounded-2xl border border-ink/8 bg-white p-4 shadow-sm"
        >
          <ProfessionnelCarte pro={sollicite.professionnel} />
          <ReponseAttendue expireLe={sollicite.expireLe} />
          {enReserve > 0 && (
            <p className="mt-2 text-xs text-ink/50">
              {enReserve === 1
                ? "1 autre professionnel est prêt à prendre le relais."
                : `${enReserve} autres professionnels sont prêts à prendre le relais.`}
            </p>
          )}
        </section>
      )}

      <section aria-label="Protocole de dispatching" className="mt-8">
        <div className="mb-2 flex h-5 items-center justify-between px-3">
          <h3 className="text-[11px] font-bold tracking-wider text-ink/50 uppercase">
            Protocole de dispatching
          </h3>
        </div>
        <SuiviTimeline items={items} />
      </section>

      <div className="mt-auto flex flex-col items-center pt-8">
        <Link
          to={demandeRoutes.liste}
          className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-paper transition hover:brightness-110"
        >
          Continuer vers mes demandes <ArrowRight className="size-4" />
        </Link>

        {/* Changer de professionnel seulement s'il en reste un en réserve */}
        {sollicite && enReserve > 0 && (
          <div className="mt-3">
            <ReorienterDemandeLien demandeId={demandeId} />
          </div>
        )}

        {/* Zone de hauteur fixe : pas de décalage entre lien et confirmation */}
        <div className="mt-1">
          <AnnulerDemandeLien demandeId={demandeId} />
        </div>
      </div>
    </div>
  );
}