import { Check, ClipboardCheck, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type {
  Notification,
  TypeNotification,
} from "../types/notification.types";
import { demandeRoutes } from "@/features/demandes/lib/demandeRoutes";
import { formatHeure } from "@/features/demandes/lib/formatDateDemande";
import { useMarquerLue } from "../hooks/useNotifications";

const STYLES: Record<
  TypeNotification,
  { fond: string; icone: React.ReactNode }
> = {
  DEMANDE_ACCEPTEE: {
    fond: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icone: <Check className="size-5" strokeWidth={2.5} aria-hidden />,
  },
  DEMANDE_SANS_REPONSE: {
    fond: "bg-amber-50 text-amber-600 border-amber-100",
    icone: <SearchX className="size-5" aria-hidden />,
  },
  DEMANDE_TERMINEE: {
    fond: "bg-ink/4 text-ink/60 border-ink/8",
    icone: <ClipboardCheck className="size-5" aria-hidden />,
  },
};

export function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const navigate = useNavigate();
  const { mutate: marquerLue } = useMarquerLue();
  const style = STYLES[notification.type];

  const ouvrir = () => {
    if (!notification.lue) marquerLue(notification.id);
    if (notification.demandeId) {
      navigate(demandeRoutes.suivi(notification.demandeId));
    }
  };

  return (
    <button
      type="button"
      onClick={ouvrir}
      className="flex w-full items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4 text-left shadow-sm transition-colors hover:bg-ink/2"
    >
      <span
        aria-hidden
        className={`grid size-11 shrink-0 place-items-center rounded-xl border ${style.fond}`}
      >
        {style.icone}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-[15px] leading-snug text-navy ${
              notification.lue ? "font-medium" : "font-bold"
            }`}
          >
            {notification.titre}
          </p>
          <span className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums text-ink/50">
            {formatHeure(notification.date)}
            {!notification.lue && (
              <span
                role="img"
                aria-label="Non lue"
                className="size-2 rounded-full bg-signal"
              />
            )}
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-snug text-ink/60">
          {notification.message}
        </p>
      </div>
    </button>
  );
}