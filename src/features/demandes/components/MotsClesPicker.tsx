import { Check, Plus } from "lucide-react";
import type { MotCleFrequent } from "../types/demande.types";

interface MotsClesPickerProps {
  items: MotCleFrequent[] | undefined;
  loading: boolean;
  selected: string[];
  onToggle: (motCle: string) => void;
}

export function MotsClesPicker({ items, loading, selected, onToggle }: MotsClesPickerProps) {
  if (!loading && !items?.length) return null; // facultatif : on masque si rien à proposer

  return (
    <section aria-labelledby="mots-cles-titre">
      <h3 id="mots-cles-titre" className="text-[11px] font-semibold uppercase tracking-wider text-ink/50">
        Mots-clés fréquents (cliquez pour ajouter) :
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {loading &&
          [0, 1, 2, 3].map((i) => (
            <span key={i} className="h-8 w-36 animate-pulse rounded-lg bg-ink/5" />
          ))}
        {items?.map(({ motCle, libelle }) => {
          const active = selected.includes(motCle);
          return (
            <button
              key={motCle}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(motCle)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-signal/40 ${
                active
                  ? "border-signal/40 bg-signal/10 text-signal"
                  : "border-transparent bg-ink/5 text-ink/70 hover:bg-ink/8"
              }`}
            >
              {active ? <Check className="size-3" /> : <Plus className="size-3 text-signal" />}
              {libelle}
            </button>
          );
        })}
      </div>
    </section>
  );
}