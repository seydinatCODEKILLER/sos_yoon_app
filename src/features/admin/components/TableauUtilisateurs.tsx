import { cn } from "@/shared/lib/utils";
import { formaterDateInscription, nomUtilisateur } from "../lib/utilisateurs";
import type { CibleUtilisateur, UtilisateurAdmin } from "../types/utilisateurs.types";
import {
  ActionsUtilisateur,
  AvatarUtilisateur,
  BadgeDemandes,
  BadgeStatutCompte,
} from "./ElementsUtilisateur";

interface Props {
  utilisateurs: UtilisateurAdmin[];
  onVoir: (u: UtilisateurAdmin) => void;
  onChangerStatut: (c: CibleUtilisateur) => void;
}

const TH = "px-3 py-3 text-xs font-medium text-muted-foreground";

/** Vue tableau. Sur petit écran, le tableau défile horizontalement : la vue cartes est faite pour le mobile. */
export function TableauUtilisateurs({ utilisateurs, onVoir, onChangerStatut }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-208 text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th scope="col" className={cn(TH, "pl-5")}>Citoyen</th>
            <th scope="col" className={TH}>Contact</th>
            <th scope="col" className={TH}>Demandes</th>
            <th scope="col" className={TH}>Inscription</th>
            <th scope="col" className={TH}>Statut</th>
            <th scope="col" className={cn(TH, "pr-5 text-right")}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {utilisateurs.map((u) => {
            const nom = nomUtilisateur(u);
            return (
              <tr key={u.id} onDoubleClick={() => onVoir(u)} className="transition-colors hover:bg-muted/40">
                <td className="py-3.5 pr-3 pl-5">
                  <div className="flex items-center gap-3">
                    <AvatarUtilisateur nomComplet={nom} statut={u.statutCompte} />
                    <button
                      type="button"
                      onClick={() => onVoir(u)}
                      className="truncate rounded text-left font-semibold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-signal/50"
                    >
                      {nom}
                    </button>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <p className="tabular-nums">{u.telephone ?? "—"}</p>
                  <p className="max-w-56 truncate text-xs text-muted-foreground">{u.email ?? "Pas d'e-mail"}</p>
                </td>
                <td className="px-3 py-3.5">
                  <BadgeDemandes n={u.nombreDemandes ?? 0} />
                </td>
                <td className="px-3 py-3.5 whitespace-nowrap text-muted-foreground">
                  {formaterDateInscription(u.dateInscription)}
                </td>
                <td className="px-3 py-3.5">
                  <BadgeStatutCompte statut={u.statutCompte} />
                </td>
                <td className="py-3.5 pr-5 pl-3">
                  <ActionsUtilisateur u={u} onVoir={onVoir} onChangerStatut={onChangerStatut} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}