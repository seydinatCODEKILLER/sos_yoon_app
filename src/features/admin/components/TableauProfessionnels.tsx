import { cn } from "@/shared/lib/utils";
import { ilYa } from "../lib/formatAdmin";
import { statutAffichage } from "../lib/professionnels";
import type { CiblePro, ProfessionnelAdmin } from "../types/professionnels.types";
import {
  ActionsPro,
  AvatarPro,
  BadgeNouveau,
  BadgeStatutPro,
  DisponibilitePro,
  MetierPro,
} from "./ElementsProfessionnel";

interface Props {
  professionnels: ProfessionnelAdmin[];
  /** Horodatage de référence (dataUpdatedAt) pour « Inscrit il y a… ». */
  maintenant: number;
  onVoir: (p: ProfessionnelAdmin) => void;
  onChangerStatut: (c: CiblePro) => void;
}

const TH = "px-3 py-3 text-xs font-medium text-muted-foreground";

export function TableauProfessionnels({ professionnels, maintenant, onVoir, onChangerStatut }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-4xl text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th scope="col" className={cn(TH, "pl-5")}>Professionnel</th>
            <th scope="col" className={TH}>Profession et spécialité</th>
            <th scope="col" className={TH}>Contact</th>
            <th scope="col" className={TH}>Disponibilité</th>
            <th scope="col" className={TH}>Statut</th>
            <th scope="col" className={cn(TH, "pr-5 text-right")}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {professionnels.map((p) => {
            const etat = statutAffichage(p);
            return (
              <tr
                key={p.id}
                onDoubleClick={() => onVoir(p)}
                className={cn(
                  "transition-colors hover:bg-muted/40",
                  etat === "EN_ATTENTE" && "bg-signal/[0.035] hover:bg-signal/[0.07]",
                )}
              >
                <td className="py-3.5 pr-3 pl-5">
                  <div className="flex items-center gap-3">
                    <AvatarPro nomComplet={p.nomComplet} etat={etat} photoUrl={p.photoUrl} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onVoir(p)}
                          className="truncate rounded text-left font-semibold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-signal/50"
                        >
                          {p.nomComplet}
                        </button>
                        {p.nouveau && <BadgeNouveau />}
                      </div>
                      {p.dateInscription && (
                        <p className="text-xs text-muted-foreground">
                          Inscrit {ilYa(p.dateInscription, maintenant)}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <MetierPro p={p} />
                </td>
                <td className="px-3 py-3.5">
                  <p className="tabular-nums">{p.telephone}</p>
                  <p className="max-w-56 truncate text-xs text-muted-foreground">{p.email ?? "Pas d'e-mail"}</p>
                </td>
                <td className="px-3 py-3.5">
                  <DisponibilitePro dispo={p.disponible} />
                </td>
                <td className="px-3 py-3.5">
                  <BadgeStatutPro etat={etat} />
                </td>
                <td className="py-3.5 pr-5 pl-3">
                  <ActionsPro p={p} etat={etat} onVoir={onVoir} onChangerStatut={onChangerStatut} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}