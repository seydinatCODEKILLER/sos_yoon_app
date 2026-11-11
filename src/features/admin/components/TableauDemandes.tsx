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
  /** Horodatage de référence (dataUpdatedAt) pour « il y a… ». */
  maintenant: number;
  onVoir: (d: DemandeAdmin) => void;
  onAction: (a: ActionDemande, d: DemandeAdmin) => void;
}

const TH = "px-3 py-3 text-xs font-medium text-muted-foreground";

export function TableauDemandes({ demandes, maintenant, onVoir, onAction }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-272 text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th scope="col" className={cn(TH, "pl-5")}>Demande</th>
            <th scope="col" className={TH}>Citoyen</th>
            <th scope="col" className={TH}>Profession et matière</th>
            <th scope="col" className={TH}>Statut</th>
            <th scope="col" className={TH}>Urgence</th>
            <th scope="col" className={TH}>Professionnel</th>
            <th scope="col" className={cn(TH, "pr-5 text-right")}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {demandes.map((d) => (
            <tr
              key={d.id}
              onDoubleClick={() => onVoir(d)}
              className={cn(
                "transition-colors hover:bg-muted/40",
                estAQualifier(d.statut) && "bg-signal/[0.035] hover:bg-signal/[0.07]",
              )}
            >
              <td className="py-3.5 pr-3 pl-5">
                <button
                  type="button"
                  onClick={() => onVoir(d)}
                  className="rounded font-semibold tabular-nums outline-none hover:underline focus-visible:ring-2 focus-visible:ring-signal/50"
                >
                  {d.reference ?? "Sans référence"}
                </button>
                {d.date && <p className="text-xs text-muted-foreground">Reçue {ilYa(d.date, maintenant)}</p>}
              </td>
              <td className="px-3 py-3.5">
                <CitoyenDemande citoyen={d.citoyen} />
              </td>
              <td className="px-3 py-3.5">
                <MetiersDemande metiers={d.metiers} matiere={d.matiere} />
              </td>
              <td className="px-3 py-3.5">
                <BadgeStatutDemande statut={d.statut} />
              </td>
              <td className="px-3 py-3.5">
                <BadgeUrgence niveau={d.niveauUrgence} />
              </td>
              <td className="px-3 py-3.5">
                {d.professionnel ? (
                  <>
                    <p className="text-sm font-medium">{d.professionnel}</p>
                    {d.tempsTraitementSecondes != null && (
                      <p className="text-xs text-muted-foreground">
                        Accepté en {formaterDuree(d.tempsTraitementSecondes)}
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">{libelleSansProfessionnel(d.statut)}</span>
                )}
              </td>
              <td className="py-3.5 pr-5 pl-3">
                <ActionsDemande d={d} onVoir={onVoir} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}