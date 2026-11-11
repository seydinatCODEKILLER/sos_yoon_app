import type { ReactNode } from "react";
import { BadgeCheck, CalendarClock, CreditCard, Hourglass, TimerOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formaterNombre } from "../lib/formatAdmin";
import type { CompteursAbonnements as Compteurs, FiltreAbonnement } from "../types/abonnements.types";

interface Props {
  donnees: Compteurs | undefined;
  filtre: FiltreAbonnement;
  onFiltre: (f: FiltreAbonnement) => void;
}

interface Carte {
  filtre: FiltreAbonnement;
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
    libelle: "Abonnements",
    icone: <CreditCard className="size-4" aria-hidden />,
    valeur: (c) => c.total ?? 0,
    legende: () => "Professionnels validés",
  },
  {
    filtre: "ESSAI",
    libelle: "En essai gratuit",
    icone: <Hourglass className="size-4" aria-hidden />,
    valeur: (c) => c.essai ?? 0,
    legende: () => "Pas encore de paiement",
  },
  {
    filtre: "ACTIF",
    libelle: "Abonnements actifs",
    icone: <BadgeCheck className="size-4" aria-hidden />,
    valeur: (c) => c.actifs ?? 0,
    legende: () => "Mensualité à jour",
  },
  {
    filtre: "ECHEANCE_PROCHE",
    libelle: "Échéance proche",
    icone: <CalendarClock className="size-4" aria-hidden />,
    valeur: (c) => c.echeanceProche ?? 0,
    legende: (c) => ((c.echeanceProche ?? 0) > 0 ? "Se terminent dans 7 jours ou moins" : "Rien à relancer"),
    accent: true,
  },
  {
    filtre: "EXPIRE",
    libelle: "Expirés",
    icone: <TimerOff className="size-4" aria-hidden />,
    valeur: (c) => c.expires ?? 0,
    legende: (c) => ((c.expires ?? 0) > 0 ? "Accès suspendu tant que rien n'est payé" : "Aucun impayé"),
    accent: true,
  },
];

/** Cartes de synthèse cliquables : chacune filtre la liste sur exactement ce qu'elle compte. */
export function CompteursAbonnements({ donnees, filtre, onFiltre }: Props) {
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