import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { apparition } from "@/shared/lib/animationsPage";
import { ilYa, initiales } from "../lib/formatAdmin";
import { infoMetier, routeDossierPro } from "../lib/metiersAdmin";
import type { InscriptionEnAttente } from "../types/dashboard.types";

interface InscriptionsEnAttenteProps {
  inscriptions: InscriptionEnAttente[];
  /** Nombre total de dossiers en attente (peut dépasser la liste affichée) */
  totalEnAttente: number;
  /** Horodatage de la dernière récupération (dataUpdatedAt) */
  maintenant: number;
}

export function InscriptionsEnAttenteCarte({
  inscriptions,
  totalEnAttente,
  maintenant,
}: InscriptionsEnAttenteProps) {
  const reduit = useReducedMotion();

  return (
    <motion.section variants={apparition} className="h-full rounded-xl border border-ink/10 bg-white p-5">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
          <span className="relative flex size-2" aria-hidden>
            {inscriptions.length > 0 && !reduit && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal/60" />
            )}
            <span className="relative inline-flex size-2 rounded-full bg-signal" />
          </span>
          Inscriptions en attente
        </h3>
        {inscriptions.length > 0 && (
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-signal">
            {inscriptions.length} dossier{inscriptions.length > 1 ? "s" : ""} prioritaire
            {inscriptions.length > 1 ? "s" : ""}
          </span>
        )}
      </header>
      <p className="mt-2 text-xs text-ink/55">
        Les plus anciens d'abord. Vérifiez les pièces justificatives avant d'approuver.
      </p>

      {inscriptions.length === 0 ? (
        <p className="mt-5 rounded-lg bg-ink/3 px-4 py-6 text-center text-sm text-ink/55">
          Aucune inscription en attente.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {inscriptions.map((i, index) => {
            const cfg = infoMetier(i.typeProfession);
            const nom = i.nomComplet || "Professionnel";
            return (
              <motion.li
                key={i.dossierId}
                initial={reduit ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 rounded-xl bg-ink/3 p-3"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold ${cfg.avatar}`}
                  aria-hidden
                >
                  {initiales(nom)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{nom}</p>
                  <p className="truncate text-xs text-ink/55">
                    {cfg.libelle}
                    {i.ville ? ` · ${i.ville}` : ""} · soumis {i.dateSoumission ? ilYa(i.dateSoumission, maintenant) : "récemment"}
                  </p>
                </div>
                {i.professionnelId && (
                  <Link
                    to={routeDossierPro(i.professionnelId)}
                    className="shrink-0 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink outline-none hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    Voir le dossier
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}

      {totalEnAttente > 0 && (
        <Link
          to="/admin/professionnels"
          className="mt-3 inline-block text-xs font-semibold text-signal hover:underline"
        >
          {totalEnAttente > inscriptions.length
            ? `Voir les ${totalEnAttente} inscriptions en attente`
            : "Ouvrir l'écran Professionnels"}
        </Link>
      )}
    </motion.section>
  );
}