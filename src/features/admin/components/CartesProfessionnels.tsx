import { Mail, Phone } from "lucide-react";
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
  maintenant: number;
  onVoir: (p: ProfessionnelAdmin) => void;
  onChangerStatut: (c: CiblePro) => void;
}

/** Vue cartes : une carte par professionnel, 1 colonne sur mobile, jusqu'à 3 sur grand écran. */
export function CartesProfessionnels({ professionnels, maintenant, onVoir, onChangerStatut }: Props) {
  return (
    <ul className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
      {professionnels.map((p) => {
        const etat = statutAffichage(p);
        return (
          <li
            key={p.id}
            className={cn(
              "flex flex-col gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md",
              etat === "EN_ATTENTE" ? "border-signal/35 bg-signal/3" : "border-border",
            )}
          >
            <div className="flex items-start gap-3">
              <AvatarPro nomComplet={p.nomComplet} etat={etat} photoUrl={p.photoUrl} className="size-12 text-sm" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="truncate text-[15px] font-semibold">{p.nomComplet}</h3>
                  {p.nouveau && <BadgeNouveau />}
                </div>
                <MetierPro p={p} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <BadgeStatutPro etat={etat} />
              <DisponibilitePro dispo={p.disponible} />
            </div>

            <dl className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Téléphone</dt>
                <Phone className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <dd className="tabular-nums">{p.telephone}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">E-mail</dt>
                <Mail className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <dd className={cn("truncate", !p.email && "text-muted-foreground")}>{p.email ?? "Pas d'e-mail"}</dd>
              </div>
            </dl>

            <div className="mt-auto space-y-3">
              {p.dateInscription && (
                <p className="text-xs text-muted-foreground">Inscrit {ilYa(p.dateInscription, maintenant)}</p>
              )}
              <ActionsPro p={p} etat={etat} onVoir={onVoir} onChangerStatut={onChangerStatut} pleineLargeur />
            </div>
          </li>
        );
      })}
    </ul>
  );
}