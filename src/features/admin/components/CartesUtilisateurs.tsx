import { CalendarDays, Mail, Phone } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ilYa } from "../lib/formatAdmin";
import { estDesactive, nomUtilisateur } from "../lib/utilisateurs";
import type { CibleUtilisateur, UtilisateurAdmin } from "../types/utilisateurs.types";
import {
  ActionsUtilisateur,
  AvatarUtilisateur,
  BadgeDemandes,
  BadgeStatutCompte,
} from "./ElementsUtilisateur";

interface Props {
  utilisateurs: UtilisateurAdmin[];
  /** Horodatage de référence (dataUpdatedAt) pour « Inscrit il y a… ». */
  maintenant: number;
  onVoir: (u: UtilisateurAdmin) => void;
  onChangerStatut: (c: CibleUtilisateur) => void;
}

/** Vue cartes : une carte par citoyen, 1 colonne sur mobile, jusqu'à 3 sur grand écran. */
export function CartesUtilisateurs({ utilisateurs, maintenant, onVoir, onChangerStatut }: Props) {
  return (
    <ul className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
      {utilisateurs.map((u) => {
        const nom = nomUtilisateur(u);
        const desactive = estDesactive(u.statutCompte);
        return (
          <li
            key={u.id}
            className={cn(
              "flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md",
              desactive && "bg-muted/30",
            )}
          >
            <div className="flex items-start gap-3">
              <AvatarUtilisateur nomComplet={nom} statut={u.statutCompte} className="size-12 text-sm" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <h3 className={cn("truncate text-[15px] font-semibold", desactive && "text-muted-foreground")}>
                  {nom}
                </h3>
                <BadgeStatutCompte statut={u.statutCompte} />
              </div>
            </div>

            <dl className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Téléphone</dt>
                <Phone className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <dd className="tabular-nums">{u.telephone ?? "—"}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">E-mail</dt>
                <Mail className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <dd className={cn("truncate", !u.email && "text-muted-foreground")}>{u.email ?? "Pas d'e-mail"}</dd>
              </div>
              {u.dateInscription && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <dt className="sr-only">Inscription</dt>
                  <CalendarDays className="size-3.5 shrink-0" aria-hidden />
                  <dd>Inscrit {ilYa(u.dateInscription, maintenant)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-auto space-y-3">
              <BadgeDemandes n={u.nombreDemandes ?? 0} />
              <ActionsUtilisateur u={u} onVoir={onVoir} onChangerStatut={onChangerStatut} pleineLargeur />
            </div>
          </li>
        );
      })}
    </ul>
  );
}