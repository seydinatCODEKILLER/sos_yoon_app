import type { ReactNode } from "react";
import { LayoutGrid, Rows3 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { VueListe } from "../hooks/useVueList";

interface Props {
  value: VueListe;
  onChange: (v: VueListe) => void;
}

const OPTIONS: { valeur: VueListe; libelle: string; icone: ReactNode }[] = [
  { valeur: "TABLEAU", libelle: "Tableau", icone: <Rows3 className="size-4" aria-hidden /> },
  { valeur: "CARTES", libelle: "Cartes", icone: <LayoutGrid className="size-4" aria-hidden /> },
];

/** Bascule entre la vue tableau et la vue cartes d'une liste. Réutilisable sur Utilisateurs et Demandes. */
export function BasculeVue({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Affichage de la liste"
      className="inline-flex shrink-0 gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5"
    >
      {OPTIONS.map(({ valeur, libelle, icone }) => {
        const actif = value === valeur;
        return (
          <button
            key={valeur}
            type="button"
            aria-pressed={actif}
            onClick={() => onChange(valeur)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-signal/50",
              actif
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {icone}
            <span className="max-sm:sr-only">{libelle}</span>
          </button>
        );
      })}
    </div>
  );
}