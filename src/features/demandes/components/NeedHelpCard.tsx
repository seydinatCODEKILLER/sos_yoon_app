import { Link } from "react-router-dom";
import { AlertTriangle, Plus } from "lucide-react";

export function NeedHelpCard() {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-white px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle size={14} className="text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">
            Une autre situation urgente ?
          </p>
          <p className="mt-0.5 max-w-sm text-xs text-muted-foreground">
            Danger immédiat : contactez la Police (17) ou les Sapeurs-pompiers
            (18). Sinon, déposez une nouvelle demande.
          </p>
        </div>
      </div>
      <Link
        to="/app/demandes/nouvelle"
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal/90"
      >
        <Plus size={15} />
        Nouvelle demande
      </Link>
    </div>
  );
}
