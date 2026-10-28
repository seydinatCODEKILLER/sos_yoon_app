import { Ban, Briefcase, UserCheck, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formaterNombre } from "../lib/formatAdmin";
import type { CompteursUtilisateurs as Compteurs } from "../types/utilisateurs.types";

function Carte({
  icone: Icone,
  libelle,
  valeur,
  note,
  accent,
}: {
  icone: LucideIcon;
  libelle: string;
  valeur?: number;
  note: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{libelle}</p>
        <span
          className={cn(
            "grid size-8 place-items-center rounded-lg",
            accent ? "bg-signal/10 text-signal" : "bg-muted text-muted-foreground",
          )}
        >
          <Icone className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">
        {valeur === undefined ? <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted" /> : formaterNombre(valeur)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

const pct = (n: number, total: number) => (total ? `${Math.round((n / total) * 100)} %` : "0 %");

export function CompteursUtilisateurs({ donnees }: { donnees?: Compteurs }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Carte icone={Users} libelle="Total utilisateurs" valeur={donnees?.total} note="Comptes inscrits" />
      <Carte
        icone={UserCheck}
        libelle="Utilisateurs actifs"
        valeur={donnees?.actifs}
        note={donnees ? `${pct(donnees.actifs, donnees.total)} du registre global` : "…"}
        accent
      />
      <Carte
        icone={Ban}
        libelle="Comptes désactivés"
        valeur={donnees?.desactives}
        note={donnees ? `${pct(donnees.desactives, donnees.total)} suspendus ou clôturés` : "…"}
      />
      <Carte icone={Briefcase} libelle="Demandes initiées" valeur={donnees?.demandesInitiees} note="Toutes demandes confondues" />
    </div>
  );
}