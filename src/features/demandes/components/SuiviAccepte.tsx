import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Check, MessageCircle, PhoneCall } from "lucide-react";
import type {
  ProfessionnelPublic,
  SuiviDemande,
} from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { formatHeure } from "../lib/formatDateDemande";
import { lienAppel, lienWhatsApp } from "../lib/contactProfessionnel";
import { ProfessionnelCarte } from "./ProfessionnelCarte";
import { SuiviTimeline } from "./SuiviTimeline";
import { VotreDemande } from "./VotreDemande";
import { etapesVersTimeline } from "../lib/etapeSuivi";

interface SuiviAccepteProps {
  suivi: SuiviDemande;
  pro: ProfessionnelPublic;
  demandeId: string;
}

export function SuiviAccepte({ suivi, pro, demandeId }: SuiviAccepteProps) {
  const reduce = useReducedMotion();

  const dateAcceptation = suivi.etapes.find(
    (e) => e.code === "DEMANDE_ACCEPTEE",
  )?.date;
  const heure = dateAcceptation ? formatHeure(dateAcceptation) : null;

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
      {/* En-tête */}
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="grid size-20 place-items-center rounded-full bg-emerald-700 text-white ring-8 ring-emerald-600/15"
        >
          <Check className="size-9" strokeWidth={3} aria-hidden />
        </motion.span>

        {heure && (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold tracking-wide text-emerald-700 uppercase">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Accepté à {heure}
          </span>
        )}

        <h2 className="mt-3 text-[26px] leading-tight font-bold text-navy">
          Un professionnel a accepté !
        </h2>
        <p className="mt-1.5 text-[15px] leading-snug text-ink/60">
          {pro.nomComplet} va vous contacter.
        </p>
      </div>

      {/* Carte du professionnel */}
      <section
        aria-label="Professionnel assigné"
        className="mt-6 rounded-2xl border border-ink/8 bg-white p-4 shadow-sm"
      >
        <ProfessionnelCarte pro={pro} confirme>
          {pro.enLigne && (
            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              Disponible maintenant
            </span>
          )}
        </ProfessionnelCarte>
        {pro.organisme && (
          <p className="mt-3 rounded-xl bg-ink/4 px-3.5 py-2.5 text-[13px] text-ink/70">
            {pro.organisme}
          </p>
        )}
      </section>

      {/* Déroulé */}
      <div className="mt-5">
        <SuiviTimeline items={items} />
      </div>

      <div className="mt-5">
        <VotreDemande demandeId={demandeId} repliable />
      </div>

      {/* Contact : par téléphone ou WhatsApp (pas de messagerie interne au MVP) */}
      <div className="mt-auto pt-6">
        {pro.telephone ? (
          <div className="grid grid-cols-2 gap-3">
            <a
              href={lienAppel(pro.telephone)}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-signal text-sm font-semibold text-paper shadow-[0_6px_18px_rgba(249,97,13,0.3)] transition hover:brightness-105"
            >
              <PhoneCall className="size-4" aria-hidden />
              Appel direct
            </a>
            <a
              href={lienWhatsApp(pro.telephone, pro.nomComplet, suivi.reference)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white text-sm font-semibold text-navy transition-colors hover:bg-ink/3"
            >
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp
            </a>
          </div>
        ) : (
          <p className="text-center text-sm text-ink/60">
            Le professionnel vous contactera très prochainement.
          </p>
        )}
        <Link
          to={demandeRoutes.liste}
          className="mt-3 inline-flex h-11 w-full items-center justify-center text-sm font-medium text-ink/60 hover:text-ink"
        >
          Voir mes demandes
        </Link>
      </div>
    </div>
  );
}