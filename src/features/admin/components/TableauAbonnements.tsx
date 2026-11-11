import { cn } from "@/shared/lib/utils";
import { formaterMontant } from "../lib/abonnements";
import type { AbonnementAdmin, CiblePaiement } from "../types/abonnements.types";
import {
  ActionsAbonnement,
  AlerteCompte,
  AvatarAbonnement,
  BadgeAbonnement,
  EcheanceAbonnement,
  MetierAbonnement,
} from "./ElementsAbonnement";

interface Props {
  abonnements: AbonnementAdmin[];
  onVoir: (a: AbonnementAdmin) => void;
  onPaiement: (c: CiblePaiement) => void;
}

const TH = "px-3 py-3 text-xs font-medium text-muted-foreground";

export function TableauAbonnements({ abonnements, onVoir, onPaiement }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-240 text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th scope="col" className={cn(TH, "pl-5")}>Professionnel</th>
            <th scope="col" className={TH}>Profession</th>
            <th scope="col" className={TH}>Abonnement</th>
            <th scope="col" className={TH}>Échéance</th>
            <th scope="col" className={TH}>Mensualité</th>
            <th scope="col" className={cn(TH, "pr-5 text-right")}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {abonnements.map((a) => {
            const nom = a.nomComplet ?? "Professionnel";
            return (
              <tr
                key={a.professionnelId}
                onDoubleClick={() => onVoir(a)}
                className={cn(
                  "transition-colors hover:bg-muted/40",
                  a.statut === "EXPIRE" && "bg-rose-50/40 hover:bg-rose-50/70 dark:bg-rose-500/4",
                )}
              >
                <td className="py-3.5 pr-3 pl-5">
                  <div className="flex items-center gap-3">
                    <AvatarAbonnement nomComplet={nom} statut={a.statut} />
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onVoir(a)}
                        className="truncate rounded text-left font-semibold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-signal/50"
                      >
                        {nom}
                      </button>
                      <AlerteCompte statutCompte={a.statutCompte} />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <MetierAbonnement metier={a.typeProfession} />
                </td>
                <td className="px-3 py-3.5">
                  <BadgeAbonnement statut={a.statut} />
                </td>
                <td className="px-3 py-3.5">
                  <EcheanceAbonnement a={a} />
                </td>
                <td className="px-3 py-3.5 whitespace-nowrap tabular-nums">{formaterMontant(a.montantMensuel)}</td>
                <td className="py-3.5 pr-5 pl-3">
                  <ActionsAbonnement a={a} onVoir={onVoir} onPaiement={onPaiement} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}