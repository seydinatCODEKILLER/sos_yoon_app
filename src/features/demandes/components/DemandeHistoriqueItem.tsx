import { Link } from "react-router-dom";
import { Check, ChevronRight, Clock, Star, X } from "lucide-react";
import type { DemandeResume } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { nomCourt } from "../lib/contactProfessionnel";
import { formatDateDemande } from "../lib/formatDateDemande";
import { etatDemande, TONS } from "../lib/statutDemandeUi";

const ICONES = { succes: Check, alerte: Clock, neutre: X, actif: Clock };

/**
 * Ligne compacte d'une demande close. À placer dans <HistoriqueListe> :
 * les lignes sont séparées par un trait fin, sans carte individuelle.
 */
export function DemandeHistoriqueItem({ demande }: { demande: DemandeResume }) {
  const etat = etatDemande(demande);
  const ton = TONS[etat.ton];
  const Icone = ICONES[etat.ton];
  const date = demande.dateCloture ?? demande.dateCreation;
  // Demande terminée avec un professionnel : l'avis reste à donner
  const aNoter = demande.statut === "TERMINEE" && !!demande.professionnel && !demande.avisDonne;

  return (
    <Link
      to={demandeRoutes.suivi(demande.id)}
      className="group flex items-center gap-3 px-4 py-3.5 outline-none transition-colors hover:bg-ink/3 focus-visible:bg-ink/4"
    >
      <span
        aria-hidden
        className={`grid size-9 shrink-0 place-items-center rounded-full ${ton.fond} ${ton.texte}`}
      >
        <Icone className="size-4" strokeWidth={2.5} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-navy">
          {demande.titre ?? "Demande d'aide"}
        </p>
        <p className="truncate text-[13px] text-ink/55">
          <span className="tabular-nums">{demande.reference}</span>
          {" · "}
          {formatDateDemande(date)}
          {demande.professionnel &&
            ` · ${nomCourt(demande.professionnel.nomComplet)}`}
        </p>
      </div>

      {aNoter ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-signal/10 px-2.5 py-1 text-xs font-semibold text-signal">
          <Star className="size-3 fill-current" aria-hidden />
          Noter
        </span>
      ) : (
        <span className={`shrink-0 text-xs font-semibold ${ton.texte}`}>
          {etat.libelle}
        </span>
      )}
      <ChevronRight
        aria-hidden
        className="size-4 shrink-0 text-ink/25 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

/** Conteneur de l'historique : une seule surface, lignes séparées par un trait */
export function HistoriqueListe({ children }: { children: React.ReactNode }) {
  return (
    <ul className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
      {children}
    </ul>
  );
}