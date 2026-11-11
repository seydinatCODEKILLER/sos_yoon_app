import { ArrowRight, Banknote, TriangleAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { initiales } from "../lib/formatAdmin";
import { libelleMetier, pastilleMetier } from "../lib/demande";
import {
  TON_URGENCE,
  cibleDepuisAbonnement,
  formaterJour,
  infoStatutAbonnement,
  libelleCompteBloque,
  libelleDelai,
  urgenceEcheance,
  echeanceDe,
} from "../lib/abonnements";
import type { AbonnementAdmin, CiblePaiement } from "../types/abonnements.types";

/**
 * Éléments communs à la vue tableau et à la vue cartes : un abonnement s'affiche de la même façon
 * quelle que soit la vue, seule la mise en page change.
 */

const AVATAR: Record<string, string> = {
  ESSAI: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  ACTIF: "bg-navy/10 text-navy dark:bg-navy/30 dark:text-white",
  EXPIRE: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

export function AvatarAbonnement({
  nomComplet,
  statut,
  className,
}: {
  nomComplet: string;
  statut: string | null;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full text-xs font-semibold",
        (statut && AVATAR[statut]) || "bg-muted text-muted-foreground",
        className,
      )}
    >
      {initiales(nomComplet.replace(/^(Me|Maître) /, "")) || "?"}
    </span>
  );
}

export function BadgeAbonnement({ statut }: { statut: string | null }) {
  const info = infoStatutAbonnement(statut);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        info.badge,
      )}
    >
      <span className={cn("size-1.5 rounded-full", info.point)} aria-hidden />
      {info.libelle}
    </span>
  );
}

export function MetierAbonnement({ metier }: { metier: string | null | undefined }) {
  if (!metier) return <span className="text-sm text-muted-foreground">—</span>;
  return (
    <p className="flex items-center gap-2 text-sm">
      <span className={cn("size-2 shrink-0 rounded-sm", pastilleMetier(metier))} aria-hidden />
      {libelleMetier(metier)}
    </p>
  );
}

/** Date d'échéance et délai restant, coloré selon l'urgence. */
export function EcheanceAbonnement({ a }: { a: AbonnementAdmin }) {
  const urgence = urgenceEcheance(a.joursRestants, a.statut);
  return (
    <div>
      <p className="whitespace-nowrap">{formaterJour(echeanceDe(a))}</p>
      <p className={cn("text-xs", TON_URGENCE[urgence])}>{libelleDelai(a.joursRestants, a.statut)}</p>
    </div>
  );
}

/** Mention quand le compte du professionnel est bloqué (impayé, désactivé…). */
export function AlerteCompte({ statutCompte }: { statutCompte: string | null | undefined }) {
  const texte = libelleCompteBloque(statutCompte);
  if (!texte) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
      <TriangleAlert className="size-3.5 shrink-0" aria-hidden /> {texte}
    </p>
  );
}

interface ActionsProps {
  a: AbonnementAdmin;
  onVoir: (a: AbonnementAdmin) => void;
  onPaiement: (c: CiblePaiement) => void;
  /** Boutons sur toute la largeur (carte mobile). */
  pleineLargeur?: boolean;
}

export function ActionsAbonnement({ a, onVoir, onPaiement, pleineLargeur }: ActionsProps) {
  const urgent = a.statut === "EXPIRE" || urgenceEcheance(a.joursRestants, a.statut) === "proche";
  return (
    <div className={cn("flex gap-2", pleineLargeur ? "w-full flex-col-reverse" : "items-center justify-end")}>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onVoir(a)}
        className="gap-1"
      >
        Voir la fiche <ArrowRight className="size-3.5" aria-hidden />
      </Button>
      <Button
        size="sm"
        variant={urgent ? "default" : "outline"}
        onClick={() => onPaiement(cibleDepuisAbonnement(a))}
        className="gap-1.5"
      >
        <Banknote className="size-3.5" aria-hidden /> Enregistrer un paiement
      </Button>
    </div>
  );
}