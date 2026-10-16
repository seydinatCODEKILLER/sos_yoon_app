import { Link } from "react-router-dom";
import { FolderOpen, Plus } from "lucide-react";
import { demandeRoutes } from "../lib/demandeRoutes";

export function MesDemandesVide() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
      <div aria-hidden className="relative grid size-44 place-items-center rounded-full bg-ink/4">
        <span className="absolute inset-4 rounded-full border border-dashed border-ink/15" />
        <span className="relative grid size-20 place-items-center rounded-2xl border border-ink/10 bg-white shadow-sm">
          <FolderOpen className="size-9 text-navy" strokeWidth={1.5} />
          <span className="absolute -right-2 -bottom-2 grid size-7 place-items-center rounded-full bg-signal text-paper ring-4 ring-white">
            <Plus className="size-4" strokeWidth={3} />
          </span>
        </span>
      </div>

      <h3 className="mt-8 max-w-xs text-balance text-[22px] leading-tight font-bold text-navy">
        Vous n'avez pas encore de demande.
      </h3>
      <p className="mt-2 max-w-xs text-[15px] leading-snug text-ink/60">
        Quand vous en ferez une, vous pourrez la suivre ici.
      </p>

      <Link
        to={demandeRoutes.nouvelle}
        className="mt-8 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-signal px-8 text-sm font-semibold text-paper shadow-[0_6px_18px_rgba(249,97,13,0.3)] transition hover:brightness-105 md:w-auto"
      >
        <Plus className="size-4" aria-hidden />
        Faire une demande
      </Link>
    </div>
  );
}