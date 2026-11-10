import { MapPin } from "lucide-react";
import {
  HAUTEUR_HEURE,
  TYPES_RDV_CONFIG,
  heure,
  libelleDuree,
  type Placement,
} from "../lib/agenda";
import type { RendezVous } from "../types/agenda.types";

interface BlocRendezVousProps {
  placement: Placement;
  /** Minutes (depuis minuit) de la première ligne de la grille */
  debutGrilleMin: number;
  maintenant: Date;
  onOuvrir: (rdv: RendezVous) => void;
}

/** Un rendez-vous dans la grille horaire : position et hauteur suivent l'heure et la durée */
export function BlocRendezVous({
  placement: p,
  debutGrilleMin,
  maintenant,
  onOuvrir,
}: BlocRendezVousProps) {
  const { rdv } = p;
  const cfg = TYPES_RDV_CONFIG[rdv.type];
  const top = ((p.debutMin - debutGrilleMin) / 60) * HAUTEUR_HEURE;
  const hauteur = Math.max(((p.finMin - p.debutMin) / 60) * HAUTEUR_HEURE - 2, 22);
  const termine = new Date(rdv.fin).getTime() < maintenant.getTime();
  const detaille = hauteur >= 44;
  const complet = hauteur >= 76;

  return (
    <button
      type="button"
      onClick={() => onOuvrir(rdv)}
      aria-label={`${cfg.libelle} : ${rdv.titre}, de ${heure(rdv.debut)} à ${heure(rdv.fin)}`}
      className={`absolute overflow-hidden rounded-md text-left transition-colors outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-signal ${cfg.bloc} ${
        termine ? "opacity-60" : ""
      }`}
      style={{
        top,
        height: hauteur,
        left: `calc(${(p.voie * 100) / p.voies}% + 2px)`,
        width: `calc(${100 / p.voies}% - 4px)`,
      }}
    >
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${cfg.barre}`} />
      <span className="flex h-full flex-col gap-0.5 py-1 pr-1.5 pl-2.5">
        {detaille && p.voies > 1 ? (
          // Colonne étroite (rendez-vous qui se chevauchent) : le titre d'abord, l'heure de début en dessous
          <>
            <span className="line-clamp-3 text-xs leading-tight font-semibold">{rdv.titre}</span>
            <span className="text-[11px] tabular-nums opacity-70">{heure(rdv.debut)}</span>
          </>
        ) : detaille ? (
          <>
            <span className="line-clamp-2 text-xs leading-tight font-semibold">{rdv.titre}</span>
            <span className="text-[11px] tabular-nums opacity-70">
              {heure(rdv.debut)} – {heure(rdv.fin)}
              {complet && ` · ${libelleDuree(rdv.debut, rdv.fin)}`}
            </span>
            {complet && rdv.lieu && (
              <span className="flex items-center gap-1 text-[11px] opacity-70">
                <MapPin className="size-3 shrink-0" aria-hidden />
                <span className="truncate">{rdv.lieu}</span>
              </span>
            )}
            {complet && rdv.dossierReference && (
              <span className="mt-auto font-mono text-[10px] opacity-60">{rdv.dossierReference}</span>
            )}
          </>
        ) : (
          <span className="truncate text-xs font-semibold">
            <span className="tabular-nums opacity-70">{heure(rdv.debut)}</span> {rdv.titre}
          </span>
        )}
      </span>
    </button>
  );
}