import { useState } from "react";
import { ArrowRight, Ban, MoreVertical, RotateCcw, UserRound } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { mediaUrl } from "@/shared/lib/mediaUrl";
import { cn } from "@/shared/lib/utils";
import { initiales } from "../lib/formatAdmin";
import { BADGE_STATUT, COULEUR_STATUT, LIBELLE_STATUT, METIERS_PRO } from "../lib/professionnels";
import type { CiblePro, ProfessionnelAdmin, StatutAffichagePro } from "../types/professionnels.types";

/**
 * Éléments communs à la vue tableau et à la vue cartes : un professionnel s'affiche de la même
 * façon quelle que soit la vue, seule la mise en page change.
 */

const AVATAR: Record<StatutAffichagePro, string> = {
  VALIDE: "bg-navy text-white",
  EN_ATTENTE: "bg-signal text-white",
  SUSPENDU: "bg-slate-500 text-white",
  REFUSE: "bg-slate-400 text-white",
  INCOMPLET: "bg-slate-300 text-slate-700",
};

/**
 * Photo du professionnel quand il en a une, sinon ses initiales sur fond coloré par statut.
 * Si l'image ne charge pas (lien expiré, fichier supprimé), on retombe sur les initiales.
 */
export function AvatarPro({
  nomComplet,
  etat,
  photoUrl,
  className,
}: {
  nomComplet: string;
  etat: StatutAffichagePro;
  photoUrl?: string | null;
  className?: string;
}) {
  const src = mediaUrl(photoUrl);
  const [echec, setEchec] = useState<string | null>(null);
  const afficherPhoto = !!src && echec !== src;

  return (
    <span
      aria-hidden
      className={cn(
        "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-semibold",
        afficherPhoto ? "bg-muted" : AVATAR[etat],
        className,
      )}
    >
      {afficherPhoto ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setEchec(src)}
          className="size-full object-cover"
        />
      ) : (
        initiales(nomComplet.replace(/^(Me|Maître) /, "")) || <UserRound className="size-4" />
      )}
    </span>
  );
}

export function BadgeNouveau() {
  return (
    <span className="shrink-0 rounded-md bg-signal/10 px-1.5 py-0.5 text-[11px] font-semibold text-signal">
      Nouveau
    </span>
  );
}

export function MetierPro({ p }: { p: Pick<ProfessionnelAdmin, "typeProfession" | "specialiteDominante"> }) {
  const m = METIERS_PRO[p.typeProfession];
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-sm font-medium">
        <span className={cn("size-2 shrink-0 rounded-sm", m.pastille)} aria-hidden /> {m.libelle}
      </p>
      <p className="truncate text-xs text-muted-foreground">{p.specialiteDominante ?? "Spécialité non renseignée"}</p>
    </div>
  );
}

export function DisponibilitePro({ dispo }: { dispo: boolean | null }) {
  const oui = dispo === true;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        oui
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-muted text-muted-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", oui ? "bg-emerald-500" : "bg-muted-foreground/60")} aria-hidden />
      {oui ? "Disponible" : "Indisponible"}
    </span>
  );
}

export function BadgeStatutPro({ etat }: { etat: StatutAffichagePro }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        BADGE_STATUT[etat],
      )}
    >
      <span className={cn("size-1.5 rounded-full", COULEUR_STATUT[etat])} aria-hidden />
      {LIBELLE_STATUT[etat]}
    </span>
  );
}

interface ActionsProps {
  p: ProfessionnelAdmin;
  etat: StatutAffichagePro;
  onVoir: (p: ProfessionnelAdmin) => void;
  onChangerStatut: (c: CiblePro) => void;
  /** Bouton principal sur toute la largeur (carte mobile). */
  pleineLargeur?: boolean;
}

export function ActionsPro({ p, etat, onVoir, onChangerStatut, pleineLargeur }: ActionsProps) {
  const instruire = etat === "EN_ATTENTE";
  const peutChangerStatut = etat === "VALIDE" || etat === "SUSPENDU";
  return (
    <div className={cn("flex items-center gap-1", pleineLargeur ? "w-full" : "justify-end")}>
      <Button
        size="sm"
        variant={instruire ? "ghost" : "outline"}
        onClick={() => onVoir(p)}
        className={cn(
          "gap-1",
          pleineLargeur && "flex-1",
          instruire && "bg-signal/10 text-signal hover:bg-signal/15 hover:text-signal",
        )}
      >
        {instruire ? "Instruire le dossier" : "Voir le profil"} <ArrowRight className="size-3.5" aria-hidden />
      </Button>
      {peutChangerStatut ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions pour ${p.nomComplet}`}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-signal/50"
          >
            <MoreVertical className="size-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                onChangerStatut({
                  id: p.id,
                  nomComplet: p.nomComplet,
                  email: p.email,
                  suspendu: etat === "SUSPENDU",
                })
              }
              className={cn(etat === "VALIDE" && "text-destructive focus:text-destructive")}
            >
              {etat === "VALIDE" ? <Ban className="size-4" aria-hidden /> : <RotateCcw className="size-4" aria-hidden />}
              {etat === "VALIDE" ? "Désactiver le compte" : "Réactiver le compte"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <span className="size-8 shrink-0" aria-hidden />
      )}
    </div>
  );
}