import { UserCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ilYa } from "../lib/formatAdmin";
import { estAQualifier, formaterDuree, libelleSansProfessionnel } from "../lib/demande";
import type { DemandeAdmin } from "../types/demandes.types";
import {
  ActionsDemande,
  BadgeStatutDemande,
  BadgeUrgence,
  CitoyenDemande,
  MetiersDemande,
  type ActionDemande,
} from "./ElementsDemande";

interface Props {
  demandes: DemandeAdmin[];
  maintenant: number;
  onVoir: (d: DemandeAdmin) => void;
  onAction: (a: ActionDemande, d: DemandeAdmin) => void;
}

/** Vue cartes : une carte par demande, 1 colonne sur mobile, jusqu'à 3 sur grand écran. */
export function CartesDemandes({ demandes, maintenant, onVoir, onAction }: Props) {
  return (
    <ul className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
      {demandes.map((d) => (
        <li
          key={d.id}
          className={cn(
            "flex flex-col gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md",
            estAQualifier(d.statut) ? "border-signal/35 bg-signal/3" : "border-border",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold tabular-nums">{d.reference ?? "Sans référence"}</h3>
              {d.date && <p className="text-xs text-muted-foreground">Reçue {ilYa(d.date, maintenant)}</p>}
            </div>
            <BadgeStatutDemande statut={d.statut} />
          </div>

          <CitoyenDemande citoyen={d.citoyen} />

          <MetiersDemande metiers={d.metiers} matiere={d.matiere} />

          <div className="flex flex-wrap items-center gap-2">
            <BadgeUrgence niveau={d.niveauUrgence} />
          </div>

          <div className="mt-auto space-y-3">
            <p className="flex items-center gap-2 text-sm">
              <UserCheck className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              {d.professionnel ? (
                <span className="min-w-0 truncate">
                  <span className="font-medium">{d.professionnel}</span>
                  {d.tempsTraitementSecondes != null && (
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      · accepté en {formaterDuree(d.tempsTraitementSecondes)}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">{libelleSansProfessionnel(d.statut)}</span>
              )}
            </p>
            <ActionsDemande d={d} onVoir={onVoir} onAction={onAction} pleineLargeur />
          </div>
        </li>
      ))}
    </ul>
  );
}