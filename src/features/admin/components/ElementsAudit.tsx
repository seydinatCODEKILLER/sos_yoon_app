import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { BADGE_TON, POINT_TON } from "../lib/demande";
import { infoActionAudit, libelleCible, libelleTypeCible, lienCible } from "../lib/audit";
import type { EntreeAudit } from "../types/audit.types";

export function BadgeActionAudit({ action }: { action: string | null }) {
  const { libelle, ton } = infoActionAudit(action);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        BADGE_TON[ton],
      )}
    >
      <span className={cn("size-1.5 rounded-full", POINT_TON[ton])} aria-hidden />
      {libelle}
    </span>
  );
}

/** Cible de l'action : son type, et son nom avec un lien vers son écran quand il existe. */
export function CibleAudit({ e }: { e: EntreeAudit }) {
  const lien = lienCible(e);
  const texte = libelleCible(e);
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{libelleTypeCible(e)}</p>
      {lien ? (
        <Link
          to={lien}
          className="block truncate rounded text-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-signal/50"
        >
          {texte}
        </Link>
      ) : (
        <p className="truncate text-sm font-medium">{texte}</p>
      )}
    </div>
  );
}

/** Motif et observations saisis par l'administrateur. */
export function DetailsAudit({ e }: { e: EntreeAudit }) {
  if (!e.motif && !e.observations) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="max-w-sm space-y-0.5 text-sm">
      {e.motif && <p className="font-medium">{e.motif}</p>}
      {e.observations && (
        <p className="line-clamp-2 text-xs text-muted-foreground" title={e.observations}>
          {e.observations}
        </p>
      )}
    </div>
  );
}