import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { formaterNombre } from "../lib/formatAdmin";

interface Props {
  page: number;
  taille: number;
  total: number;
  onChange: (page: number) => void;
}

function pagesVisibles(page: number, pages: number): (number | "…")[] {
  if (pages <= 6) return Array.from({ length: pages }, (_, i) => i + 1);
  const debut = Math.min(Math.max(page - 1, 2), pages - 3);
  return [1, ...(debut > 2 ? ["…" as const] : []), debut, debut + 1, debut + 2, ...(debut + 2 < pages - 1 ? ["…" as const] : []), pages];
}

export function PaginationAdmin({ page, taille, total, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / taille));
  const de = total === 0 ? 0 : (page - 1) * taille + 1;
  const a = Math.min(page * taille, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-4 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Affichage de {de} à {a} sur {formaterNombre(total)} utilisateurs
      </p>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Précédent
        </Button>
        {pagesVisibles(page, pages).map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-1 text-muted-foreground">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "grid size-8 place-items-center rounded-lg text-sm tabular-nums",
                p === page ? "bg-signal text-white" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {p}
            </button>
          ),
        )}
        <Button variant="ghost" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Suivant
        </Button>
      </div>
    </div>
  );
}