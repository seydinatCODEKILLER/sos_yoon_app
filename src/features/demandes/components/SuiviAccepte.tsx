import { motion, useReducedMotion } from "motion/react";
import {
  BadgeCheck,
  Check,
  Clock,
  MessageCircle,
  Navigation,
  PhoneCall,
} from "lucide-react";
import type {
  ProfessionnelAccepte,
  SuiviDemande,
} from "../types/demande.types";
import {
  initiales,
  lienAppel,
  lienWhatsApp,
} from "../lib/contactProfessionnel";
import { SuiviTimeline, type TimelineItem } from "./SuiviTimeline";

interface SuiviAccepteProps {
  suivi: SuiviDemande;
  pro: ProfessionnelAccepte;
}

const formatKm = (km: number) =>
  `${km.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km`;

export function SuiviAccepte({ suivi, pro }: SuiviAccepteProps) {
  const reduce = useReducedMotion();

  const heure = suivi.dateAcceptation
    ? new Date(suivi.dateAcceptation).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const items: TimelineItem[] = [
    {
      id: "enregistree",
      titre: "Demande enregistrée",
      description: "Protocole chiffré de bout en bout",
      status: "done",
    },
    {
      id: "analysee",
      titre: suivi.matiereLibelle
        ? `Message analysé : ${suivi.matiereLibelle}`
        : "Message analysé",
      description: "Qualification juridique automatique validée",
      status: "done",
    },
    {
      id: "notifies",
      titre: "Professionnels notifiés",
      description: `Tour de garde ${pro.communeLibelle} mobilisé`,
      status: "done",
    },
    {
      id: "acceptee",
      titre: `Demande acceptée par ${pro.nomComplet}`,
      description: "Assignation officielle enregistrée à l'Ordre",
      descriptionTone: "success",
      status: "done",
      badge: "CONFIRMÉ",
      badgeTone: "success",
    },
  ];

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
          {pro.nomComplet}, {pro.metier} · à {formatKm(pro.distanceKm)}
        </p>
      </div>

      {/* Carte du professionnel */}
      <section
        aria-label="Professionnel assigné"
        className="mt-6 rounded-2xl border border-ink/8 bg-white p-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {pro.photoUrl ? (
              <img
                src={pro.photoUrl}
                alt=""
                className="size-14 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="grid size-14 place-items-center rounded-full bg-navy text-base font-semibold text-paper"
              >
                {initiales(pro.nomComplet)}
              </span>
            )}
            <span className="absolute -right-0.5 -bottom-0.5 grid size-5 place-items-center rounded-full bg-emerald-600 text-white ring-2 ring-white">
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5">
              <span className="truncate text-base font-bold text-navy">
                {pro.nomComplet}
              </span>
              {pro.verifie && (
                <BadgeCheck
                  className="size-5 shrink-0 fill-signal text-white"
                  aria-label="Professionnel vérifié"
                />
              )}
            </p>
            <p className="text-[13px] leading-snug text-ink/60">
              {pro.organisme}
            </p>
            {pro.disponibleImmediatement && (
              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                Disponible immédiatement
              </span>
            )}
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-ink/4 p-3.5">
          <div className="flex items-start gap-2">
            <Navigation className="mt-0.5 size-4 shrink-0 text-ink/50" aria-hidden />
            <div>
              <dt className="text-[11px] text-ink/60">Distance</dt>
              <dd className="text-[13px] leading-snug font-semibold text-ink">
                {formatKm(pro.distanceKm)} ({pro.communeLibelle})
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-ink/50" aria-hidden />
            <div>
              <dt className="text-[11px] text-ink/60">Prise de contact</dt>
              <dd className="text-[13px] leading-snug font-semibold text-ink">
                &lt; {pro.delaiContactMinutes} minutes
              </dd>
            </div>
          </div>
        </dl>
      </section>

      {/* Déroulé */}
      <div className="mt-5">
        <SuiviTimeline items={items} />
      </div>

      {/* Contact */}
      <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
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
          Messagerie
        </a>
      </div>
    </div>
  );
}