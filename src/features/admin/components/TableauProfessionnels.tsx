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
import { COULEUR_STATUT, LIBELLE_STATUT, METIERS_PRO, TEXTE_STATUT, statutAffichage } from "../lib/professionnels";
import type { CiblePro, ProfessionnelAdmin, StatutAffichagePro } from "../types/professionnels.types";

interface Props {
  professionnels: ProfessionnelAdmin[];
  onVoir: (p: ProfessionnelAdmin) => void;
  onChangerStatut: (c: CiblePro) => void;
}

const AVATAR: Record<StatutAffichagePro, string> = {
  VALIDE: "bg-navy text-white",
  EN_ATTENTE: "bg-signal text-white",
  SUSPENDU: "bg-slate-500 text-white",
  REFUSE: "bg-slate-400 text-white",
};

function Identite({ p, etat }: { p: ProfessionnelAdmin; etat: StatutAffichagePro }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full text-xs font-semibold", AVATAR[etat])}>
        {initiales(p.nomComplet.replace(/^Me /, ""))}
      </span>
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate font-medium">{p.nomComplet}</span>
        {p.nouveau && (
          <span className="shrink-0 rounded-md bg-signal/10 px-1.5 py-0.5 text-[10px] font-semibold text-signal">
            Nouveau
          </span>
        )}
      </div>
    </div>
  );
}

function Metier({ p }: { p: ProfessionnelAdmin }) {
  const m = METIERS_PRO[p.typeProfession];
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-sm font-medium">
        <span className={cn("size-2 shrink-0 rounded-sm", m.pastille)} /> {m.libelle}
      </p>
      <p className="truncate text-xs text-muted-foreground">{p.specialiteDominante}</p>
    </div>
  );
}

function Disponibilite({ dispo }: { dispo: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        dispo ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-muted text-muted-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", dispo ? "bg-emerald-500" : "bg-muted-foreground/60")} />
      {dispo ? "Disponible" : "Indisponible"}
    </span>
  );
}

function StatutPro({ etat }: { etat: StatutAffichagePro }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-medium", TEXTE_STATUT[etat])}>
      <span className={cn("size-2 rounded-full", COULEUR_STATUT[etat])} /> {LIBELLE_STATUT[etat]}
    </span>
  );
}

function Actions({ p, etat, onVoir, onChangerStatut }: { p: ProfessionnelAdmin; etat: StatutAffichagePro } & Omit<Props, "professionnels">) {
  const instruire = etat === "EN_ATTENTE";
  const peutChangerStatut = etat === "VALIDE" || etat === "SUSPENDU";
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        variant={instruire ? "ghost" : "outline"}
        onClick={() => onVoir(p)}
        className={cn("gap-1", instruire && "bg-signal/10 text-signal hover:bg-signal/15 hover:text-signal")}
      >
        {instruire ? "Instruire le dossier" : "Voir le profil"} <ArrowRight className="size-3.5" />
      </Button>
      {peutChangerStatut ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions pour ${p.nomComplet}`}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                onChangerStatut({ id: p.id, nomComplet: p.nomComplet, email: p.email, suspendu: etat === "SUSPENDU" })
              }
              className={cn(etat === "VALIDE" && "text-destructive focus:text-destructive")}
            >
              {etat === "VALIDE" ? <Ban className="size-4" /> : <RotateCcw className="size-4" />}
              {etat === "VALIDE" ? "Désactiver le compte" : "Réactiver le compte"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <span className="size-8" aria-hidden />
      )}
    </div>
  );
}

export function TableauProfessionnels({ professionnels, onVoir, onChangerStatut }: Props) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Nom &amp; prénom</th>
              <th className="px-3 py-3">Profession &amp; spécialité</th>
              <th className="px-3 py-3">Téléphone / Email</th>
              <th className="px-3 py-3">Disponibilité</th>
              <th className="px-3 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {professionnels.map((p) => {
              const etat = statutAffichage(p);
              return (
                <tr
                  key={p.id}
                  className={cn(
                    "border-b border-border/60 last:border-0 hover:bg-muted/40",
                    etat === "EN_ATTENTE" && "bg-signal/4",
                  )}
                >
                  <td className="px-5 py-4"><Identite p={p} etat={etat} /></td>
                  <td className="px-3 py-4"><Metier p={p} /></td>
                  <td className="px-3 py-4">
                    <p>{p.telephone}</p>
                    <p className="text-xs text-muted-foreground">{p.email ?? "—"}</p>
                  </td>
                  <td className="px-3 py-4"><Disponibilite dispo={p.disponible} /></td>
                  <td className="px-3 py-4"><StatutPro etat={etat} /></td>
                  <td className="px-5 py-4">
                    <Actions p={p} etat={etat} onVoir={onVoir} onChangerStatut={onChangerStatut} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-border md:hidden">
        {professionnels.map((p) => {
          const etat = statutAffichage(p);
          return (
            <li key={p.id} className={cn("space-y-3 p-4", etat === "EN_ATTENTE" && "bg-signal/4")}>
              <div className="flex items-center justify-between gap-3">
                <Identite p={p} etat={etat} />
                <StatutPro etat={etat} />
              </div>
              <Metier p={p} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.telephone}</span>
                <Disponibilite dispo={p.disponible} />
              </div>
              <Actions p={p} etat={etat} onVoir={onVoir} onChangerStatut={onChangerStatut} />
            </li>
          );
        })}
      </ul>
    </>
  );
}