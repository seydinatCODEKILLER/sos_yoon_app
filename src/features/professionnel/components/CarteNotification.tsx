import { motion } from "motion/react";
import { ArrowRight, CreditCard, Inbox, Timer } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { apparition } from "@/shared/lib/animationsPage";
import { cibleDe, estAbonnement, ilYaNotification } from "../lib/notifications";
import type { Notification } from "../types/notification.types";

interface CarteNotificationProps {
  notification: Notification;
  /** Horodatage de la dernière récupération (dataUpdatedAt) */
  maintenant: number;
  onOuvrir: (n: Notification) => void;
}

export function CarteNotification({ notification: n, maintenant, onOuvrir }: CarteNotificationProps) {
  const abonnement = estAbonnement(n);
  const aCible = cibleDe(n) !== null;
  const Icone = abonnement ? CreditCard : Inbox;
  const teinte = abonnement ? "bg-navy/10 text-navy" : "bg-signal/10 text-signal";

  return (
    <motion.li variants={apparition} className="list-none">
      <article
        className={`relative flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5 ${
          n.lue
            ? "border-ink/10"
            : `border-l-[3px] border-y-ink/10 border-r-ink/10 ${abonnement ? "border-l-navy" : "border-l-signal"}`
        }`}
      >
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${teinte}`} aria-hidden>
          <Icone className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className={`truncate text-sm text-ink ${n.lue ? "font-medium" : "font-bold"}`}>
              {!n.lue && <span className="sr-only">Non lue : </span>}
              {n.titre}
            </h4>
            <span className="shrink-0 text-[11px] text-ink/50">
              {ilYaNotification(n.dateCreation, maintenant)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-xs text-ink/60">{n.message}</p>
            {(n.delaiReponseMinutes != null || n.lieu) && (
              <p className="hidden shrink-0 items-center gap-2 text-[11px] text-ink/50 md:flex">
                {n.delaiReponseMinutes != null && (
                  <span className="inline-flex items-center gap-1 font-medium text-signal">
                    <Timer className="size-3" aria-hidden />
                    {n.delaiReponseMinutes} min
                  </span>
                )}
                {n.lieu && <span>{n.lieu}</span>}
              </p>
            )}
          </div>
        </div>

        {n.action && aCible && (
          <Button
            type="button"
            size="sm"
            onClick={() => onOuvrir(n)}
            aria-label={n.action.libelle}
            className="h-8 shrink-0 gap-1.5 rounded-md bg-signal px-2.5 text-xs font-semibold text-white after:absolute after:inset-0 hover:bg-signal/90 sm:px-3"
          >
            <span className="hidden sm:inline">{n.action.libelle}</span>
            <ArrowRight className="size-3.5" aria-hidden />
          </Button>
        )}
      </article>
    </motion.li>
  );
}