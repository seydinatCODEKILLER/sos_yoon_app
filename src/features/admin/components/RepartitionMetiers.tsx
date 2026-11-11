import { motion, useReducedMotion } from "motion/react";
import { apparition } from "@/shared/lib/animationsPage";
import { infoMetier, ORDRE_METIERS } from "../lib/metiersAdmin";
import type { RepartitionMetier } from "../types/dashboard.types";

export function RepartitionMetiers({ repartition }: { repartition: RepartitionMetier[] }) {
  const reduit = useReducedMotion();
  const total = repartition.reduce((s, r) => s + r.nombre, 0);
  const lignes = ORDRE_METIERS.map((m) => {
    const nombre = repartition.find((r) => r.typeProfession === m)?.nombre ?? 0;
    return { metier: m, nombre, pourcent: total ? Math.round((nombre / total) * 100) : 0 };
  });

  return (
    <motion.section variants={apparition} className="h-full rounded-xl border border-ink/10 bg-white p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink">Répartition par métier</h3>
          <p className="text-xs text-ink/55">Professionnels actifs, par corps de métier</p>
        </div>
        <span className="rounded-lg bg-ink/5 px-2.5 py-1 text-xs font-bold text-ink">
          {total} Pro{total > 1 ? "s" : ""}
        </span>
      </header>

      {total === 0 ? (
        <p className="mt-5 rounded-lg bg-ink/3 px-4 py-10 text-center text-sm text-ink/55">
          Aucun professionnel actif pour le moment.
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-4 gap-3">
          {lignes.map(({ metier, nombre, pourcent }, i) => {
            const cfg = infoMetier(metier);
            return (
              <li key={metier} className="flex flex-col items-center gap-2">
                <span className="text-sm font-bold text-ink tabular-nums">{nombre}</span>
                <div
                  className={`relative flex h-36 w-full max-w-14 items-end overflow-hidden rounded-2xl ${cfg.piste}`}
                  role="img"
                  aria-label={`${cfg.pluriel} : ${nombre} (${pourcent} %)`}
                >
                  <motion.div
                    initial={reduit ? false : { height: 0 }}
                    animate={{ height: `${Math.max(pourcent, nombre > 0 ? 8 : 0)}%` }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.21, 0.47, 0.32, 0.98] }}
                    whileHover={{ opacity: 0.85 }}
                    className={`w-full rounded-2xl ${cfg.barre}`}
                  />
                </div>
                <span className="text-xs font-bold text-ink">{cfg.pluriel}</span>
                <span className="text-[11px] text-ink/50">{pourcent}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </motion.section>
  );
}