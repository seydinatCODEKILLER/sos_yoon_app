import {
  Bell,
  CircleX,
  ClipboardCheck,
  MessageCircle,
  SearchX,
  Send,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import {
  actionMiseEnAvant,
  dateCompleteNotification,
  heureNotification,
  tonDe,
  type TonNotification,
} from "../lib/notification";
import type { Notification } from "../types/notification.types";

const PASTILLES: Record<TonNotification, string> = {
  succes: "bg-emerald-50 text-emerald-600",
  attention: "bg-amber-50 text-amber-600",
  alerte: "bg-red-50 text-red-600",
  info: "bg-navy/8 text-navy",
  neutre: "bg-ink/6 text-ink/60",
};

const ACTIONS: Record<TonNotification, string> = {
  succes: "text-emerald-700",
  attention: "text-amber-700",
  alerte: "text-red-700",
  info: "text-navy",
  neutre: "text-navy",
};

const CLASSE_ICONE = "size-5";

/**
 * Renvoie l'élément d'icône, et non le composant : choisir un composant dans une variable
 * pendant le rendu le recrée à chaque fois (règle du React Compiler).
 */
function iconeDe(n: Notification) {
  switch (n.type) {
    case "DEMANDE_ENVOYEE":
      return <Send className={CLASSE_ICONE} aria-hidden />;
    case "DEMANDE_ACCEPTEE":
      return <UserCheck className={CLASSE_ICONE} aria-hidden />;
    case "DEMANDE_TERMINEE":
    case "COMPTE_RENDU_DISPONIBLE":
      return <ClipboardCheck className={CLASSE_ICONE} aria-hidden />;
    case "NOUVEAU_MESSAGE":
      return <MessageCircle className={CLASSE_ICONE} aria-hidden />;
    case "COMPTE_SUSPENDU":
      return <ShieldAlert className={CLASSE_ICONE} aria-hidden />;
    case "SYSTEME":
      if (/annul/i.test(n.titre)) return <CircleX className={CLASSE_ICONE} aria-hidden />;
      if (/recherche/i.test(n.titre)) return <SearchX className={CLASSE_ICONE} aria-hidden />;
      return <Bell className={CLASSE_ICONE} aria-hidden />;
    default:
      return <Bell className={CLASSE_ICONE} aria-hidden />;
  }
}

interface Props {
  notification: Notification;
  /** Horodatage de référence (dataUpdatedAt) : évite un Date.now() à chaque rendu. */
  maintenant: number;
  onOuvrir: (n: Notification) => void;
}

/** Une ligne de la boîte de notifications : toute la ligne est cliquable. */
export function NotificationItem({ notification: n, maintenant, onOuvrir }: Props) {
  const ton = tonDe(n);
  const enAvant = actionMiseEnAvant(n);

  return (
    <li>
      <button
        type="button"
        onClick={() => onOuvrir(n)}
        aria-label={`${n.lue ? "" : "Non lue : "}${n.titre}`}
        className={`group flex w-full items-start gap-3.5 px-4 py-4 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-inset ${
          n.lue ? "hover:bg-ink/3" : "bg-signal/5 hover:bg-signal/8"
        }`}
      >
        <span className="relative mt-0.5 shrink-0">
          <span
            className={`grid size-11 place-items-center rounded-full ${PASTILLES[ton]}`}
          >
            {iconeDe(n)}
          </span>
          {!n.lue && (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-signal ring-2 ring-white"
            />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <span
              className={`text-[15px] leading-snug text-navy ${
                n.lue ? "font-medium" : "font-bold"
              }`}
            >
              {n.titre}
            </span>
            <time
              dateTime={n.dateCreation ?? undefined}
              title={dateCompleteNotification(n.dateCreation)}
              className={`shrink-0 text-xs tabular-nums ${
                n.lue ? "text-ink/45" : "font-medium text-signal"
              }`}
            >
              {heureNotification(n.dateCreation, maintenant)}
            </time>
          </span>

          <span className="mt-1 line-clamp-3 block text-[13.5px] leading-relaxed text-ink/65">
            {n.message}
          </span>

          {(n.action || n.referenceDemande) && (
            <span className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {n.action && (
                <span
                  className={
                    enAvant
                      ? "inline-flex h-8 items-center rounded-full bg-navy px-3.5 text-[13px] font-semibold text-paper shadow-sm transition-transform group-hover:-translate-y-px"
                      : `text-[13px] font-semibold underline-offset-4 group-hover:underline ${ACTIONS[ton]}`
                  }
                >
                  {n.action.libelle}
                </span>
              )}
              {n.referenceDemande && (
                <span className="rounded-md bg-ink/5 px-1.5 py-0.5 text-[11px] font-medium text-ink/55">
                  {n.referenceDemande}
                </span>
              )}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}