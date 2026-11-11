import { ArrowRight, Ban, MoreVertical, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { initiales } from "../lib/formatAdmin";
import {
  LIBELLE_DEMANDES,
  SEUIL_DEMANDES_ELEVE,
  cibleDe,
  infoCompte,
  nomUtilisateur,
  peutDesactiver,
  peutReactiver,
  type EtatCompte,
} from "../lib/utilisateurs";
import type { CibleUtilisateur, UtilisateurAdmin } from "../types/utilisateurs.types";

/**
 * Éléments communs à la vue tableau, à la vue cartes et à la fiche : un citoyen s'affiche de la
 * même façon quelle que soit la vue, seule la mise en page change.
 */

const AVATAR: Record<EtatCompte, string> = {
  ACTIF: "bg-navy/10 text-navy dark:bg-navy/30 dark:text-white",
  DESACTIVE: "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300",
  AUTRE: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
};

const BADGE: Record<EtatCompte, string> = {
  ACTIF: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  DESACTIVE: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  AUTRE: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

const POINT: Record<EtatCompte, string> = {
  ACTIF: "bg-emerald-500",
  DESACTIVE: "bg-rose-500",
  AUTRE: "bg-amber-500",
};

export function AvatarUtilisateur({
  nomComplet,
  statut,
  className,
}: {
  nomComplet: string;
  statut: string | null;
  className?: string;
}) {
  const { etat } = infoCompte(statut);
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full text-xs font-semibold",
        AVATAR[etat],
        className,
      )}
    >
      {initiales(nomComplet) || "?"}
    </span>
  );
}

export function BadgeStatutCompte({ statut }: { statut: string | null }) {
  const { etat, libelle } = infoCompte(statut);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        BADGE[etat],
      )}
    >
      <span className={cn("size-1.5 rounded-full", POINT[etat])} aria-hidden />
      {libelle}
    </span>
  );
}

export function BadgeDemandes({ n }: { n: number }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap tabular-nums",
        n >= SEUIL_DEMANDES_ELEVE
          ? "bg-signal/10 text-signal"
          : n === 0
            ? "bg-muted/60 text-muted-foreground"
            : "bg-muted text-foreground",
      )}
    >
      {LIBELLE_DEMANDES(n)}
    </span>
  );
}

interface ActionsProps {
  u: UtilisateurAdmin;
  onVoir: (u: UtilisateurAdmin) => void;
  onChangerStatut: (c: CibleUtilisateur) => void;
  /** Bouton principal sur toute la largeur (carte mobile). */
  pleineLargeur?: boolean;
}

export function ActionsUtilisateur({ u, onVoir, onChangerStatut, pleineLargeur }: ActionsProps) {
  const reactiver = peutReactiver(u.statutCompte);
  const desactiver = peutDesactiver(u.statutCompte);
  const nom = nomUtilisateur(u);
  return (
    <div className={cn("flex items-center gap-1", pleineLargeur ? "w-full" : "justify-end")}>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onVoir(u)}
        className={cn("gap-1", pleineLargeur && "flex-1")}
      >
        Voir le profil <ArrowRight className="size-3.5" aria-hidden />
      </Button>
      {reactiver || desactiver ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions pour ${nom}`}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-signal/50"
          >
            <MoreVertical className="size-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onChangerStatut(cibleDe(u))}
              className={cn(desactiver && "text-destructive focus:text-destructive")}
            >
              {desactiver ? <Ban className="size-4" aria-hidden /> : <RotateCcw className="size-4" aria-hidden />}
              {desactiver ? "Désactiver le compte" : "Réactiver le compte"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <span className="size-8 shrink-0" aria-hidden />
      )}
    </div>
  );
}