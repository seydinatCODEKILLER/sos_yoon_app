import type { ReactNode } from "react";
import { CircleCheck, Inbox, ListChecks, Search, Wrench } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formaterNombre } from "../lib/formatAdmin";
import type { CompteursDemandes as Compteurs, FiltreStatutDemande } from "../types/demandes.types";

interface Props {
  donnees: Compteurs | undefined;
  filtre: FiltreStatutDemande;
  onFiltre: (f: FiltreStatutDemande) => void;
}

interface Carte {
  filtre: FiltreStatutDemande;
  libelle: string;
  icone: ReactNode;
  valeur: (c: Compteurs) => number;
  legende: (c: Compteurs) => string;
  /** Carte qui réclame une action de l'administrateur. */
  accent?: boolean;
}

const CARTES: Carte[] = [
  {
    filtre: "TOUS",
    libelle: "Toutes les demandes",
    icone: <Inbox className="size-4" aria-hidden />,
    valeur: (c) => c.total ?? 0,
    legende: () => "Depuis le lancement",
  },
  {
    filtre: "A_QUALIFIER",
    libelle: "À qualifier",
    icone: <Wrench className="size-4" aria-hidden />,
    valeur: (c) => c.aQualifier ?? 0,
    legende: (c) => ((c.aQualifier ?? 0) > 0 ? "Le système n'a pas pu les orienter" : "Rien à qualifier"),
    accent: true,
  },
  {
    filtre: "EN_RECHERCHE",
    libelle: "En recherche",
    icone: <Search className="size-4" aria-hidden />,
    valeur: (c) => c.enRecherche ?? 0,
    legende: () => "Pas encore de professionnel",
  },
  {
    filtre: "EN_COURS",
    libelle: "En cours",
    icone: <ListChecks className="size-4" aria-hidden />,
    valeur: (c) => c.enCours ?? 0,
    legende: () => "Pris en charge",
  },
  {
    filtre: "TERMINEES",
    libelle: "Terminées",
    icone: <CircleCheck className="size-4" aria-hidden />,
    valeur: (c) => c.terminees ?? 0,
    legende: (c) => ((c.total ?? 0) > 0 ? `${Math.round(((c.terminees ?? 0) / c.total) * 100)} % du total` : "—"),
  },
];

/** Cartes de synthèse cliquables : chacune filtre la liste sur exactement ce qu'elle compte. */
export function CompteursDemandes({ donnees, filtre, onFiltre }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {CARTES.map((c) => {
        const actif = filtre === c.filtre;
        const attention = c.accent && !!donnees && c.valeur(donnees) > 0;
        return (
          <button
            key={c.filtre}
            type="button"
            aria-pressed={actif}
            onClick={() => onFiltre(actif && c.filtre !== "TOUS" ? "TOUS" : c.filtre)}
            className={cn(
              "flex min-h-32 flex-col justify-between rounded-2xl border bg-card p-4 text-left outline-none transition-colors",
              "hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-signal/50",
              attention ? "border-signal/35 bg-signal/4 hover:bg-signal/[0.07]" : "border-border",
              actif && "ring-2 ring-signal/40",
              "max-lg:last:col-span-2",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className={cn("text-[13px]", attention ? "font-medium text-signal" : "text-muted-foreground")}>
                {c.libelle}
              </span>
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-lg",
                  attention ? "bg-signal/10 text-signal" : "bg-muted text-muted-foreground",
                )}
              >
                {c.icone}
              </span>
            </div>
            {donnees ? (
              <div>
                <p className="text-3xl font-semibold tabular-nums">{formaterNombre(c.valeur(donnees))}</p>
                <p className={cn("mt-1 text-xs", attention ? "text-signal" : "text-muted-foreground")}>
                  {c.legende(donnees)}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
                <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}