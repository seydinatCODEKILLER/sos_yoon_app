import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Clock, Search } from "lucide-react";
import type { SuiviDemande } from "../types/demande.types";
import { formatDuree } from "../lib/formatDuration";
import { demandeRoutes } from "../lib/demandeRoutes";
import { useSecondesEcoulees } from "../hooks/useSecondesEcoulees";
import { useAnnulerDemande } from "../hooks/useAnnulerDemande";
import { SuiviTimeline, type TimelineItem } from "./SuiviTimeline";

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

export function SuiviRecherche({ suivi }: { suivi: SuiviDemande }) {
  const secondes = useSecondesEcoulees(suivi.dateEnvoi);
  const { annuler, isCancelling } = useAnnulerDemande(suivi.demandeId);
  const [confirmation, setConfirmation] = useState(false);

  const metier = suivi.metierPluriel ?? "professionnels";

  // Étape en cours : 1 = analyse du message, 2 = notification des professionnels
  const courante = suivi.etape === "ENREGISTREE" ? 1 : 2;
  const statut = (i: number): TimelineItem["status"] =>
    i < courante ? "done" : i === courante ? "current" : "pending";

  const items: TimelineItem[] = [
    {
      id: "enregistree",
      titre: "Demande enregistrée",
      description: "Horodatée et chiffrée de bout en bout",
      status: statut(0),
    },
    {
      id: "analysee",
      titre: "Message analysé",
      description: suivi.matiereLibelle
        ? `Qualification : ${suivi.matiereLibelle}`
        : "Qualification de votre situation",
      status: statut(1),
    },
    {
      id: "notifies",
      titre: "Professionnels notifiés",
      description: suivi.zoneElargie
        ? "Tour de garde étendu aux secteurs mitoyens"
        : "Tour de garde de votre secteur",
      status: statut(2),
      badge:
        suivi.nbProfessionnelsNotifies > 0
          ? `${suivi.nbProfessionnelsNotifies} ${metier}`
          : undefined,
    },
    {
      id: "relation",
      titre: "Mise en relation",
      description: "Liaison audio sécurisée & mandat direct",
      status: statut(3),
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center text-center">
        <SearchOrb />

        <h2 className="mt-2 text-[28px] leading-tight font-bold text-navy">
          Recherche en cours
        </h2>
        <p className="mt-2 text-[15px] leading-snug text-ink/60">
          Nous contactons les {metier} proches de vous.
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink/6 px-3 py-1.5 text-xs font-medium text-ink/70 tabular-nums">
          <Clock className="size-3.5" aria-hidden />
          depuis {formatDuree(secondes)}
        </span>
      </div>

      <section aria-label="Protocole de dispatching" className="mt-8">
        <div className="mb-2 flex h-5 items-center justify-between px-3">
          <h3 className="text-[11px] font-bold tracking-wider text-ink/50 uppercase">
            Protocole de dispatching
          </h3>
          {suivi.zoneElargie && (
            <span className="text-xs font-semibold text-signal">
              Zone élargie
            </span>
          )}
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

        {/* Zone de hauteur fixe : pas de décalage entre lien et confirmation */}
        <div className="mt-3 flex min-h-10 items-center justify-center gap-4 text-sm">
          {confirmation ? (
            <>
              <button
                type="button"
                onClick={annuler}
                disabled={isCancelling}
                className="font-semibold text-red-600 hover:underline disabled:opacity-60"
              >
                {isCancelling ? "Annulation…" : "Oui, annuler"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmation(false)}
                disabled={isCancelling}
                className="font-medium text-ink/60 hover:underline"
              >
                Non, continuer
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmation(true)}
              className="text-ink/60 underline underline-offset-4 hover:text-ink"
            >
              Annuler ma demande
            </button>
          )}
        </div>
      </div>
    </div>
  );
}