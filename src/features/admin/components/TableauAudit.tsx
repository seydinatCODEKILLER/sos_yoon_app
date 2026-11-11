import { cn } from "@/shared/lib/utils";
import { formaterDateHeure } from "../lib/demande";
import type { EntreeAudit } from "../types/audit.types";
import { BadgeActionAudit, CibleAudit, DetailsAudit } from "./ElementsAudit";

interface Props {
  entrees: EntreeAudit[];
}

const TH = "px-3 py-3 text-xs font-medium text-muted-foreground";

function Admin({ e }: { e: EntreeAudit }) {
  return <span className="font-medium">{e.admin?.nomComplet ?? "Administrateur inconnu"}</span>;
}

export function TableauAudit({ entrees }: Props) {
  return (
    <>
      {/* Bureau */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-4xl text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th scope="col" className={cn(TH, "pl-5")}>Date</th>
              <th scope="col" className={TH}>Administrateur</th>
              <th scope="col" className={TH}>Action</th>
              <th scope="col" className={TH}>Cible</th>
              <th scope="col" className={TH}>Détails</th>
              <th scope="col" className={cn(TH, "pr-5")}>Adresse IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {entrees.map((e) => (
              <tr key={e.id} className="align-top transition-colors hover:bg-muted/40">
                <td className="py-3.5 pr-3 pl-5 whitespace-nowrap tabular-nums text-muted-foreground">
                  {formaterDateHeure(e.date)}
                </td>
                <td className="px-3 py-3.5">
                  <Admin e={e} />
                </td>
                <td className="px-3 py-3.5">
                  <BadgeActionAudit action={e.action} />
                </td>
                <td className="px-3 py-3.5">
                  <CibleAudit e={e} />
                </td>
                <td className="px-3 py-3.5">
                  <DetailsAudit e={e} />
                </td>
                <td className="py-3.5 pr-5 pl-3 whitespace-nowrap tabular-nums text-xs text-muted-foreground">
                  {e.adresseIp ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <ul className="divide-y divide-border md:hidden">
        {entrees.map((e) => (
          <li key={e.id} className="space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <BadgeActionAudit action={e.action} />
              <span className="text-xs tabular-nums text-muted-foreground">{formaterDateHeure(e.date)}</span>
            </div>
            <CibleAudit e={e} />
            <DetailsAudit e={e} />
            <p className="text-xs text-muted-foreground">
              Par <Admin e={e} />
              {e.adresseIp && <> · {e.adresseIp}</>}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}