import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { PhoneCall, SearchX, Users } from "lucide-react";
import type { SuiviDemande } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { AnnulerDemandeLien } from "./AnnulerDemandeLien";

interface SuiviAucunProfessionnelProps {
  demandeId: string;
  suivi: SuiviDemande;
}

/**
 * RECHERCHE_PROFESSIONNEL : plus aucun professionnel dans la file.
 * La demande reste ouverte : elle est transmise à l'équipe SOS Yoon (spec 8.7).
 */
export function SuiviAucunProfessionnel({
  demandeId,
  suivi,
}: SuiviAucunProfessionnelProps) {
  const reduce = useReducedMotion();
  const numero = suivi.numeroUrgence;
  const chiffres = numero?.replace(/\D/g, "");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mt-4 grid size-20 place-items-center rounded-full bg-amber-100 text-amber-700 ring-8 ring-amber-500/10"
        >
          <SearchX className="size-9" aria-hidden />
        </motion.span>

        <h2 className="mt-6 text-[26px] leading-tight font-bold text-navy">
          Aucun professionnel disponible
        </h2>
        <p className="mt-2 max-w-sm text-[15px] leading-snug text-ink/60">
          Aucun professionnel n'a pu prendre votre demande pour l'instant.
        </p>
      </div>

      <aside className="mt-8 flex gap-3 rounded-2xl bg-ink/4 p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-signal/15 text-signal">
          <Users className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">
            Votre demande est transmise à l'équipe SOS Yoon
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-ink/60">
            Elle reste active : nous cherchons un professionnel pour vous.
          </p>
        </div>
      </aside>

      {numero && chiffres && (
        <a
          href={`tel:${chiffres}`}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm transition-colors hover:bg-ink/3"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <PhoneCall className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink">
              Une urgence ?
            </span>
            <span className="block text-[13px] text-ink/60">
              Appelez le {numero}
            </span>
          </span>
        </a>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Link
          to={demandeRoutes.liste}
          className="inline-flex h-13 w-full items-center justify-center rounded-xl bg-navy px-6 text-sm font-semibold text-paper transition hover:brightness-110"
        >
          Voir mes demandes
        </Link>
        <AnnulerDemandeLien demandeId={demandeId} />
      </div>
    </div>
  );
}