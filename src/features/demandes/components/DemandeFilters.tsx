import { motion } from "motion/react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

export type StatutFilter =
  | "TOUTES"
  | "EN_COURS"
  | "TERMINEES"
  | "ANNULEES";

interface DemandeFiltersProps {
  statutFilter: StatutFilter;
  onStatutChange: (statut: StatutFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const TABS: { value: StatutFilter; label: string }[] = [
  { value: "TOUTES", label: "Toutes" },
  { value: "EN_COURS", label: "En cours" },
  { value: "TERMINEES", label: "Terminées" },
  { value: "ANNULEES", label: "Annulées" },
];

export function DemandeFilters({
  statutFilter,
  onStatutChange,
  search,
  onSearchChange,
}: DemandeFiltersProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Onglets de statut */}
      <div className="relative flex flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onStatutChange(tab.value)}
            className="relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          >
            {statutFilter === tab.value && (
              <motion.div
                layoutId="statut-tab-bg"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-md bg-ink"
              />
            )}
            <span
              className={`relative z-10 ${
                statutFilter === tab.value
                  ? "text-paper"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Recherche */}
      <div className="relative sm:w-64">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher une demande..."
          className="border-border bg-white pl-8 pr-8 text-sm"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}