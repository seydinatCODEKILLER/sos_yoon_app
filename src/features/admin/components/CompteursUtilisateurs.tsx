import type { ReactNode } from "react";
import { Ban, Briefcase, UserCheck, Users } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formaterNombre } from "../lib/formatAdmin";
import type { CompteursUtilisateurs as Compteurs, FiltreStatutUtilisateur } from "../types/utilisateurs.types";

interface Props {
  donnees: Compteurs | undefined;
  filtre: FiltreStatutUtilisateur;
  onFiltre: (f: FiltreStatutUtilisateur) => void;
}

interface Carte {
  /** Absent : carte purement informative, non cliquable. */
  filtre?: FiltreStatutUtilisateur;
  libelle: string;
  icone: ReactNode;
  valeur: (c: Compteurs) => number;
  legende: (c: Compteurs) => string;
}

const pct = (n: number, total: number) => (total ? `${Math.round((n / total) * 100)} %` : "0 %");

const CARTES: Carte[] = [
  {
    filtre: "TOUS",
    libelle: "Citoyens inscrits",
    icone: <Users className="size-4" aria-hidden />,
    valeur: (c) => c.total ?? 0,
    legende: () => "Tous les comptes citoyens",
  },
  {
    filtre: "ACTIF",
    libelle: "Comptes actifs",
    icone: <UserCheck className="size-4" aria-hidden />,
    valeur: (c) => c.actifs ?? 0,
    legende: (c) => `${pct(c.actifs ?? 0, c.total ?? 0)} des comptes`,
  },
  {
    filtre: "DESACTIVE",
    libelle: "Comptes désactivés",
    icone: <Ban className="size-4" aria-hidden />,
    valeur: (c) => c.desactives ?? 0,
    legende: (c) => ((c.desactives ?? 0) > 0 ? "Accès bloqué par l'administration" : "Aucun compte bloqué"),
  },
  {
    libelle: "Demandes déposées",
    icone: <Briefcase className="size-4" aria-hidden />,
    valeur: (c) => c.demandesInitiees ?? 0,
    legende: () => "Brouillons exclus",
  },
];

const BASE = "flex min-h-32 flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left";

function Contenu({ c, donnees }: { c: Carte; donnees: Compteurs | undefined }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] text-muted-foreground">{c.libelle}</span>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
          {c.icone}
        </span>
      </div>
      {donnees ? (
        <div>
          <p className="text-3xl font-semibold tabular-nums">{formaterNombre(c.valeur(donnees))}</p>
          <p className="mt-1 text-xs text-muted-foreground">{c.legende(donnees)}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        </div>
      )}
    </>
  );
}

/** Cartes de synthèse : les trois premières filtrent la liste, la dernière est informative. */
export function CompteursUtilisateurs({ donnees, filtre, onFiltre }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {CARTES.map((c) => {
        const cible = c.filtre;
        if (!cible) {
          return (
            <div key={c.libelle} className={BASE}>
              <Contenu c={c} donnees={donnees} />
            </div>
          );
        }
        const actif = filtre === cible;
        return (
          <button
            key={c.libelle}
            type="button"
            aria-pressed={actif}
            onClick={() => onFiltre(actif && cible !== "TOUS" ? "TOUS" : cible)}
            className={cn(
              BASE,
              "outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-signal/50",
              actif && "ring-2 ring-signal/40",
            )}
          >
            <Contenu c={c} donnees={donnees} />
          </button>
        );
      })}
    </div>
  );
}