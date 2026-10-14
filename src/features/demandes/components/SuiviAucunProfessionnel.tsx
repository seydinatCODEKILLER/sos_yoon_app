import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Loader2, MapPinned, Radar, SearchX } from "lucide-react";
import type { SuiviDemande } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { useElargirRecherche } from "../hooks/useElargirRecherche";

export function SuiviAucunProfessionnel({ suivi }: { suivi: SuiviDemande }) {
  const reduce = useReducedMotion();
  const { elargir, isElargissing } = useElargirRecherche(suivi.demandeId);

  const metier = suivi.metierPluriel ?? "professionnels";
  const contacte =
    suivi.nbProfessionnelsNotifies > 0
      ? `Nous avons contacté ${suivi.nbProfessionnelsNotifies} ${metier} près de chez vous, sans réponse pour l'instant.`
      : "Aucun professionnel n'a répondu à votre demande pour l'instant.";

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
          {contacte}
        </p>
      </div>

      {suivi.elargissementPossible ? (
        <aside className="mt-8 flex gap-3 rounded-2xl bg-ink/4 p-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-signal/15 text-signal">
            <MapPinned className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">
              Élargir la zone de recherche
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-ink/60">
              Nous étendrons la recherche aux secteurs voisins pour toucher
              davantage de {metier}. Votre demande reste active.
            </p>
          </div>
        </aside>
      ) : (
        <aside className="mt-8 rounded-2xl bg-ink/4 p-4">
          <p className="text-sm font-semibold text-ink">
            La zone est déjà élargie au maximum
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-ink/60">
            Aucun professionnel n'est disponible pour le moment. Réessayez dans
            quelques minutes avec une nouvelle demande.
          </p>
        </aside>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-8">
        {suivi.elargissementPossible ? (
          <>
            <button
              type="button"
              onClick={elargir}
              disabled={isElargissing}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-signal px-6 text-sm font-semibold text-paper shadow-[0_6px_18px_rgba(249,97,13,0.3)] transition hover:brightness-105 disabled:opacity-60"
            >
              {isElargissing ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Élargissement…
                </>
              ) : (
                <>
                  <Radar className="size-4" aria-hidden />
                  Élargir la recherche
                </>
              )}
            </button>
            <Link
              to={demandeRoutes.liste}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-6 text-sm font-semibold text-navy transition-colors hover:bg-ink/3"
            >
              Voir mes demandes
            </Link>
          </>
        ) : (
          <>
            <Link
              to={demandeRoutes.nouvelle}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-paper transition hover:brightness-110"
            >
              Faire une nouvelle demande <ArrowRight className="size-4" />
            </Link>
            <Link
              to={demandeRoutes.liste}
              className="inline-flex h-13 w-full items-center justify-center rounded-xl border border-ink/10 bg-white px-6 text-sm font-semibold text-navy transition-colors hover:bg-ink/3"
            >
              Voir mes demandes
            </Link>
          </>
        )}
      </div>
    </div>
  );
}