import { CalendarClock, Wallet } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { echeanceDe, formaterJour, formaterMontant, libelleDelai, libelleEcheance, TON_URGENCE, urgenceEcheance } from "../lib/abonnements";
import type { AbonnementAdmin, CiblePaiement } from "../types/abonnements.types";
import {
  ActionsAbonnement,
  AlerteCompte,
  AvatarAbonnement,
  BadgeAbonnement,
  MetierAbonnement,
} from "./ElementsAbonnement";

interface Props {
  abonnements: AbonnementAdmin[];
  onVoir: (a: AbonnementAdmin) => void;
  onPaiement: (c: CiblePaiement) => void;
}

/** Vue cartes : une carte par abonnement, 1 colonne sur mobile, jusqu'à 3 sur grand écran. */
export function CartesAbonnements({ abonnements, onVoir, onPaiement }: Props) {
  return (
    <ul className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
      {abonnements.map((a) => {
        const nom = a.nomComplet ?? "Professionnel";
        const urgence = urgenceEcheance(a.joursRestants, a.statut);
        return (
          <li
            key={a.professionnelId}
            className={cn(
              "flex min-w-0 flex-col gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md",
              a.statut === "EXPIRE" ? "border-rose-200 bg-rose-50/40 dark:border-rose-500/25" : "border-border",
            )}
          >
            <div className="flex items-start gap-3">
              <AvatarAbonnement nomComplet={nom} statut={a.statut} className="size-12 text-sm" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <h3 className="truncate text-[15px] font-semibold">{nom}</h3>
                <MetierAbonnement metier={a.typeProfession} />
                <BadgeAbonnement statut={a.statut} />
              </div>
            </div>

            <dl className="space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <dt className="sr-only">{libelleEcheance(a.statut)}</dt>
                <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <dd>
                  {libelleEcheance(a.statut)} le {formaterJour(echeanceDe(a))}
                  <span className={cn("block text-xs", TON_URGENCE[urgence])}>
                    {libelleDelai(a.joursRestants, a.statut)}
                  </span>
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Mensualité</dt>
                <Wallet className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <dd className="tabular-nums">{formaterMontant(a.montantMensuel)} par mois</dd>
              </div>
            </dl>

            <div className="mt-auto space-y-3">
              <AlerteCompte statutCompte={a.statutCompte} />
              <ActionsAbonnement a={a} onVoir={onVoir} onPaiement={onPaiement} pleineLargeur />
            </div>
          </li>
        );
      })}
    </ul>
  );
}