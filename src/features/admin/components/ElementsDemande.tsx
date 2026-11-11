import { ArrowRight, Ban, MoreVertical, Phone, RefreshCcw, UserCheck, UserRound, Wrench } from "lucide-react";
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
  BADGE_TON,
  POINT_TON,
  estAQualifier,
  infoStatut,
  infoUrgence,
  libelleMetier,
  pastilleMetier,
  peutAnnuler,
  peutQualifier,
  peutReaffecter,
  peutRelancer,
} from "../lib/demande";
import type { CitoyenRef, DemandeAdmin } from "../types/demandes.types";

/**
 * Éléments communs à la vue tableau, à la vue cartes et à la fiche : une demande s'affiche de la
 * même façon quelle que soit la vue, seule la mise en page change.
 */

export type ActionDemande = "qualifier" | "reaffecter" | "relancer" | "annuler";

export function BadgeStatutDemande({ statut }: { statut: string | null }) {
  const { libelle, ton } = infoStatut(statut);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        BADGE_TON[ton],
      )}
    >
      <span className={cn("size-1.5 rounded-full", POINT_TON[ton])} aria-hidden />
      {libelle}
    </span>
  );
}

export function BadgeUrgence({ niveau }: { niveau: string | null }) {
  const u = infoUrgence(niveau);
  if (!u) return <span className="text-xs text-muted-foreground">Non définie</span>;
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap", u.classe)}>
      {u.libelle}
    </span>
  );
}

export function MetiersDemande({ metiers, matiere }: { metiers: string[]; matiere: string | null }) {
  return (
    <div className="min-w-0">
      {metiers.length > 0 ? (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm font-medium">
          {metiers.map((m) => (
            <span key={m} className="inline-flex items-center gap-2">
              <span className={cn("size-2 shrink-0 rounded-sm", pastilleMetier(m))} aria-hidden />
              {libelleMetier(m)}
            </span>
          ))}
        </p>
      ) : (
        <p className="text-sm font-medium text-muted-foreground">Métier non défini</p>
      )}
      <p className="truncate text-xs text-muted-foreground">{matiere ?? "Matière non définie"}</p>
    </div>
  );
}

export function CitoyenDemande({ citoyen, compact }: { citoyen: CitoyenRef | null; compact?: boolean }) {
  const nom = citoyen?.nomComplet ?? "Citoyen inconnu";
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
      >
        {initiales(nom) || <UserRound className="size-4" />}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{nom}</p>
        {citoyen?.telephone && (
          <p className={cn("flex items-center gap-1 text-xs text-muted-foreground tabular-nums", compact && "sr-only")}>
            <Phone className="size-3" aria-hidden /> {citoyen.telephone}
          </p>
        )}
      </div>
    </div>
  );
}

interface ActionsProps {
  d: DemandeAdmin;
  onVoir: (d: DemandeAdmin) => void;
  onAction: (a: ActionDemande, d: DemandeAdmin) => void;
  /** Bouton principal sur toute la largeur (carte mobile). */
  pleineLargeur?: boolean;
}

export function ActionsDemande({ d, onVoir, onAction, pleineLargeur }: ActionsProps) {
  const aQualifier = estAQualifier(d.statut) && peutQualifier(d.statut);
  const reaffecter = peutReaffecter(d.statut);
  const relancer = peutRelancer(d.statut, d.professionnel);
  const annuler = peutAnnuler(d.statut);
  const qualifierAuMenu = !aQualifier && peutQualifier(d.statut);
  const aDesActions = reaffecter || relancer || annuler || qualifierAuMenu;

  return (
    <div className={cn("flex items-center gap-1", pleineLargeur ? "w-full" : "justify-end")}>
      {aQualifier ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAction("qualifier", d)}
          className={cn(
            "gap-1 bg-signal/10 text-signal hover:bg-signal/15 hover:text-signal",
            pleineLargeur && "flex-1",
          )}
        >
          Qualifier <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onVoir(d)}
          className={cn("gap-1", pleineLargeur && "flex-1")}
        >
          Voir le détail <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      )}

      {aDesActions ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions pour la demande ${d.reference ?? ""}`}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-signal/50"
          >
            <MoreVertical className="size-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {aQualifier && (
              <DropdownMenuItem onClick={() => onVoir(d)}>Voir le détail</DropdownMenuItem>
            )}
            {qualifierAuMenu && (
              <DropdownMenuItem onClick={() => onAction("qualifier", d)}>
                <Wrench className="size-4" aria-hidden /> Requalifier
              </DropdownMenuItem>
            )}
            {reaffecter && (
              <DropdownMenuItem onClick={() => onAction("reaffecter", d)}>
                <UserCheck className="size-4" aria-hidden /> Attribuer à un professionnel
              </DropdownMenuItem>
            )}
            {relancer && (
              <DropdownMenuItem onClick={() => onAction("relancer", d)}>
                <RefreshCcw className="size-4" aria-hidden /> Relancer la recherche
              </DropdownMenuItem>
            )}
            {annuler && (
              <DropdownMenuItem
                onClick={() => onAction("annuler", d)}
                className="text-destructive focus:text-destructive"
              >
                <Ban className="size-4" aria-hidden /> Annuler la demande
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <span className="size-8 shrink-0" aria-hidden />
      )}
    </div>
  );
}