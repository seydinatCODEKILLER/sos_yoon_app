import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { apparition } from "@/shared/lib/animationsPage";
import { TYPES_RDV_CONFIG, heure } from "../lib/agenda";
import type { RendezVous } from "../types/agenda.types";

interface CarteRendezVousProps {
  rdv: RendezVous;
  /** Horodatage de la dernière récupération (dataUpdatedAt) */
  maintenant: number;
  onOuvrir: (rdv: RendezVous) => void;
}

export function CarteRendezVous({ rdv, maintenant, onOuvrir }: CarteRendezVousProps) {
  const cfg = TYPES_RDV_CONFIG[rdv.type];
  const Icone = cfg.icone;
  const termine = new Date(rdv.fin).getTime() < maintenant;

  return (
    <motion.li variants={apparition} className="list-none">
      <button
        type="button"
        onClick={() => onOuvrir(rdv)}
        className={`w-full space-y-1.5 rounded-lg border p-3 text-left shadow-sm outline-none hover:shadow focus-visible:ring-2 focus-visible:ring-signal ${cfg.carte} ${
          termine ? "opacity-60" : ""
        }`}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-ink tabular-nums">
            {heure(rdv.debut)} – {heure(rdv.fin)}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${cfg.badge}`}
          >
            <Icone className="size-3" aria-hidden />
            {cfg.libelle}
          </span>
        </span>
        <span className="line-clamp-2 block text-sm font-semibold text-ink">{rdv.titre}</span>
        {rdv.lieu && (
          <span className="flex items-center gap-1 text-[11px] text-ink/60">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{rdv.lieu}</span>
          </span>
        )}
        <span className="flex items-center justify-between gap-2 text-[10px] text-ink/50">
          {rdv.dossierReference ? (
            <span className="font-mono">{rdv.dossierReference}</span>
          ) : (
            <span />
          )}
          {termine && <span className="font-semibold uppercase">Terminé</span>}
        </span>
      </button>
    </motion.li>
  );
}