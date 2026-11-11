import {
  Bell,
  BadgeCheck,
  CalendarClock,
  CircleCheck,
  CreditCard,
  FileX2,
  FolderOpen,
  Scale,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import {
  dateCompleteNotification,
  estAbonnement,
  estSollicitation,
  heureNotification,
  tonDe,
  type TonNotification,
} from "../lib/notifications";
import type { Notification } from "../types/notification.types";

const TONS: Record<TonNotification, { pastille: string; action: string }> = {
  action: {
    pastille: "bg-signal/12 text-signal",
    action: "bg-signal text-white",
  },
  alerte: {
    pastille: "bg-red-50 text-red-600",
    action: "text-red-700",
  },
  succes: {
    pastille: "bg-emerald-50 text-emerald-600",
    action: "text-emerald-700",
  },
  info: {
    pastille: "bg-navy/8 text-navy",
    action: "text-navy",
  },
};

const CLASSE_ICONE = "size-4.5";

/**
 * Renvoie l'élément d'icône, et non le composant : choisir un composant dans une variable
 * pendant le rendu le recrée à chaque fois (règle du React Compiler).
 */
function iconeDe(n: Notification) {
  if (estSollicitation(n)) return <Scale className={CLASSE_ICONE} aria-hidden />;
  if (estAbonnement(n)) {
    if (n.type === "ABONNEMENT_EXPIRE")
      return <TriangleAlert className={CLASSE_ICONE} aria-hidden />;
    return tonDe(n) === "alerte" ? (
      <CalendarClock className={CLASSE_ICONE} aria-hidden />
    ) : (
      <CreditCard className={CLASSE_ICONE} aria-hidden />
    );
  }
  switch (n.type) {
    case "COMPTE_SUSPENDU":
      return <ShieldAlert className={CLASSE_ICONE} aria-hidden />;
    case "DOSSIER_APPROUVE":
      return <BadgeCheck className={CLASSE_ICONE} aria-hidden />;
    case "DOSSIER_REJETE":
      return <FileX2 className={CLASSE_ICONE} aria-hidden />;
    case "DEMANDE_ACCEPTEE":
      return <FolderOpen className={CLASSE_ICONE} aria-hidden />;
    case "DEMANDE_TERMINEE":
      return <CircleCheck className={CLASSE_ICONE} aria-hidden />;
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

/**
 * Une ligne de la boîte de notifications : pastille d'icône avec point « non lue »,
 * titre, extrait, heure, puis l'action proposée. Toute la ligne est cliquable.
 */
export function CarteNotification({ notification: n, maintenant, onOuvrir }: Props) {
  const ton = TONS[tonDe(n)];
  const demandeEntrante = estSollicitation(n);

  return (
    <li>
      <button
        type="button"
        onClick={() => onOuvrir(n)}
        aria-label={`${n.lue ? "" : "Non lue : "}${n.titre}`}
        className={`group flex w-full items-start gap-3.5 px-4 py-3.5 text-left transition-colors outline-none focus-visible:bg-ink/4 focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-inset sm:px-5 ${
          n.lue ? "hover:bg-ink/3" : "bg-signal/4.5 hover:bg-signal/8"
        }`}
      >
        <span className="relative mt-0.5 shrink-0">
          <span
            className={`grid size-10 place-items-center rounded-full ${ton.pastille}`}
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
              className={`text-[15px] leading-snug text-ink ${
                n.lue ? "font-medium" : "font-semibold"
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

          <span className="mt-0.5 line-clamp-2 block text-sm leading-relaxed text-ink/65">
            {n.message}
          </span>

          {(n.action || n.referenceDemande) && (
            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {n.action && (
                <span
                  className={
                    demandeEntrante
                      ? `inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold shadow-sm transition-transform group-hover:-translate-y-px ${ton.action}`
                      : `text-[13px] font-semibold underline-offset-4 group-hover:underline ${ton.action}`
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