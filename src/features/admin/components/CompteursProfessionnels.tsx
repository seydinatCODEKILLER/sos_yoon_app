import { Ban, Clock, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formaterNombre } from "../lib/formatAdmin";
import type { CompteursProfessionnels as Compteurs, FiltreStatutPro } from "../types/professionnels.types";

interface CarteProps {
  icone: LucideIcon;
  libelle: string;
  valeur?: number;
  note?: string;
  actif: boolean;
  accent?: boolean;
  onClick: () => void;
}

function Carte({ icone: Icone, libelle, valeur, note, actif, accent, onClick }: CarteProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        "rounded-2xl border bg-card p-4 text-left transition-colors hover:border-foreground/20",
        accent ? "border-signal/30 bg-signal/4" : "border-border",
        actif && "ring-2 ring-signal/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cn("text-xs font-medium", accent ? "text-signal" : "text-muted-foreground")}>{libelle}</p>
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg",
            accent ? "bg-signal/10 text-signal" : "bg-muted text-muted-foreground",
          )}
        >
          <Icone className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">
        {valeur === undefined ? (
          <span className="inline-block h-7 w-14 animate-pulse rounded bg-muted" />
        ) : (
          formaterNombre(valeur)
        )}
      </p>
      <p className={cn("mt-1 text-xs", accent ? "text-signal" : "text-muted-foreground")}>{note ?? "\u00a0"}</p>
    </button>
  );
}

interface Props {
  donnees?: Compteurs;
  filtre: FiltreStatutPro;
  onFiltre: (f: FiltreStatutPro) => void;
}

export function CompteursProfessionnels({ donnees: d, filtre, onFiltre }: Props) {
  // Un second clic sur la carte active retire le filtre
  const basculer = (f: FiltreStatutPro) => onFiltre(filtre === f ? "TOUS" : f);
  const detail =
    d?.refuses !== undefined && d?.suspendus !== undefined
      ? `${d.refuses} refusé${d.refuses > 1 ? "s" : ""} · ${d.suspendus} suspendu${d.suspendus > 1 ? "s" : ""}`
      : undefined;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Carte
        icone={Users}
        libelle="Total professionnels"
        valeur={d?.total}
        note={d?.nouveauxCeMois ? `+${d.nouveauxCeMois} ce mois` : undefined}
        actif={filtre === "TOUS"}
        onClick={() => onFiltre("TOUS")}
      />
      <Carte
        icone={Clock}
        libelle="En attente de validation"
        valeur={d?.enAttente}
        note={d?.enAttente ? "Action requise" : "Aucun dossier en attente"}
        accent
        actif={filtre === "EN_ATTENTE"}
        onClick={() => basculer("EN_ATTENTE")}
      />
      <Carte
        icone={ShieldCheck}
        libelle="Validés & actifs"
        valeur={d?.actifs}
        note={d ? `${d.total ? Math.round((d.actifs / d.total) * 100) : 0} % d'activité globale` : undefined}
        actif={filtre === "VALIDE"}
        onClick={() => basculer("VALIDE")}
      />
      <Carte
        icone={Ban}
        libelle="Suspendus / refusés"
        valeur={d?.suspendusOuRefuses}
        note={detail}
        actif={filtre === "SUSPENDU_OU_REJETE"}
        onClick={() => basculer("SUSPENDU_OU_REJETE")}
      />
    </div>
  );
}