import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { apparition } from "@/shared/lib/animationsPage";
import { ilYa, initiales } from "../lib/formatAdmin";
import { METIERS_ADMIN, routeDossierPro } from "../lib/metiersAdmin";
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
  return (
    <motion.section variants={apparition} className="rounded-xl border border-ink/10 bg-white p-5">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
          <span className="size-2 rounded-full bg-signal" aria-hidden />
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
        Vérifiez les pièces justificatives avant octroi du badge officiel.
      </p>

      {inscriptions.length === 0 ? (
        <p className="mt-5 rounded-lg bg-ink/3 px-4 py-6 text-center text-sm text-ink/55">
          Aucune inscription en attente.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {inscriptions.map((i) => {
            const cfg = METIERS_ADMIN[i.typeProfession];
            return (
              <li
                key={i.dossierId}
                className="flex items-center gap-3 rounded-xl bg-ink/3 p-3"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold ${cfg.avatar}`}
                  aria-hidden
                >
                  {initiales(i.nomComplet)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{i.nomComplet}</p>
                  <p className="truncate text-xs text-ink/55">
                    {cfg.libelle} · soumis {ilYa(i.dateSoumission, maintenant)}
                  </p>
                </div>
                <Link
                  to={routeDossierPro(i.professionnelId)}
                  className="shrink-0 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink outline-none hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-signal"
                >
                  Voir le dossier
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {totalEnAttente > inscriptions.length && (
        <Link
          to="/admin/professionnels"
          className="mt-3 inline-block text-xs font-semibold text-signal hover:underline"
        >
          Voir les {totalEnAttente} inscriptions en attente
        </Link>
      )}
    </motion.section>
  );
}