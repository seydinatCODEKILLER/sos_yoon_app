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
  estActif,
  formaterDateInscription,
} from "../lib/utilisateurs";
import type { UtilisateurAdmin } from "../types/utilisateurs.types";

interface Props {
  utilisateurs: UtilisateurAdmin[];
  onChangerStatut: (u: UtilisateurAdmin) => void;
  /** Absent tant que la fiche utilisateur n'existe pas. */
  onVoirProfil?: (u: UtilisateurAdmin) => void;
}

function Statut({ actif }: { actif: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={cn("size-2 rounded-full", actif ? "bg-signal" : "bg-muted-foreground/50")} />
      {actif ? "Actif" : "Désactivé"}
    </span>
  );
}

function Demandes({ n }: { n: number }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        n >= SEUIL_DEMANDES_ELEVE
          ? "bg-signal/10 text-signal"
          : n === 0
            ? "text-muted-foreground"
            : "bg-muted text-foreground",
      )}
    >
      {LIBELLE_DEMANDES(n)}
    </span>
  );
}

function Avatar({ u }: { u: UtilisateurAdmin }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy/10 text-xs font-semibold text-navy">
      {initiales(`${u.prenom} ${u.nom}`)}
    </span>
  );
}

function Actions({ u, onChangerStatut, onVoirProfil }: { u: UtilisateurAdmin } & Omit<Props, "utilisateurs">) {
  const actif = estActif(u.statutCompte);
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        disabled={!onVoirProfil}
        title={onVoirProfil ? undefined : "Bientôt disponible"}
        onClick={() => onVoirProfil?.(u)}
        className="gap-1 text-signal hover:text-signal"
      >
        Voir le profil <ArrowRight className="size-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Actions pour ${u.prenom} ${u.nom}`}
          className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onChangerStatut(u)}
            className={cn(actif && "text-destructive focus:text-destructive")}
          >
            {actif ? <Ban className="size-4" /> : <RotateCcw className="size-4" />}
            {actif ? "Désactiver le compte" : "Réactiver le compte"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function TableauUtilisateurs({ utilisateurs, onChangerStatut, onVoirProfil }: Props) {
  return (
    <>
      {/* Bureau */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Nom &amp; prénom</th>
              <th className="px-3 py-3">Téléphone / Email</th>
              <th className="px-3 py-3">Demandes</th>
              <th className="px-3 py-3">Inscription</th>
              <th className="px-3 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar u={u} />
                    <span className="font-medium">{u.prenom} {u.nom}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <p>{u.telephone}</p>
                  <p className="text-xs text-muted-foreground">{u.email ?? "—"}</p>
                </td>
                <td className="px-3 py-3"><Demandes n={u.nombreDemandes} /></td>
                <td className="px-3 py-3 text-muted-foreground">{formaterDateInscription(u.dateInscription)}</td>
                <td className="px-3 py-3"><Statut actif={estActif(u.statutCompte)} /></td>
                <td className="px-5 py-3">
                  <Actions u={u} onChangerStatut={onChangerStatut} onVoirProfil={onVoirProfil} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <ul className="divide-y divide-border md:hidden">
        {utilisateurs.map((u) => (
          <li key={u.id} className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <Avatar u={u} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{u.prenom} {u.nom}</p>
                <p className="truncate text-xs text-muted-foreground">{u.telephone}</p>
              </div>
              <Statut actif={estActif(u.statutCompte)} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Demandes n={u.nombreDemandes} />
              <span>Inscrit le {formaterDateInscription(u.dateInscription)}</span>
            </div>
            <Actions u={u} onChangerStatut={onChangerStatut} onVoirProfil={onVoirProfil} />
          </li>
        ))}
      </ul>
    </>
  );
}