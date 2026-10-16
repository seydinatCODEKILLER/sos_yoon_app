import { useState } from "react";
import { Loader2 } from "lucide-react";
import { demandeErrorMessage } from "@/features/demandes/lib/demandeErrors";
import { useNotifications, useToutMarquerLu } from "../hooks/useNotifications";
import { groupeParJour } from "../lib/groupeParJour";
import {
  FiltresNotifications,
  type FiltreNotifications,
} from "../components/FiltresNotifications";
import { NotificationItem } from "../components/NotificationItem";
import { NotificationsVide } from "../components/NotificationsVide";

export function NotificationsPage() {
  const [filtre, setFiltre] = useState<FiltreNotifications>("TOUTES");
  const { data: notifications, isPending, error } = useNotifications();
  const { mutate: toutLire, isPending: enCours } = useToutMarquerLu();

  const nonLues = notifications?.filter((n) => !n.lue).length ?? 0;
  // Tous les types actuels concernent des demandes ; l'onglet filtrera plus tard
  const visibles =
    filtre === "NON_LUES"
      ? (notifications ?? []).filter((n) => !n.lue)
      : (notifications ?? []);
  const groupes = groupeParJour(visibles);

  let contenu: React.ReactNode;

  if (isPending) {
    contenu = (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-ink/40" aria-label="Chargement" />
      </div>
    );
  } else if (error || !notifications) {
    contenu = (
      <p role="alert" className="py-24 text-center text-sm text-red-600">
        {demandeErrorMessage(error)}
      </p>
    );
  } else if (notifications.length === 0) {
    contenu = <NotificationsVide />;
  } else if (visibles.length === 0) {
    contenu = (
      <NotificationsVide
        titre="Tout est à jour."
        message="Vous n'avez aucune notification non lue."
      />
    );
  } else {
    contenu = (
      <div className="space-y-6">
        {groupes.map((groupe) => (
          <section key={groupe.libelle} aria-label={groupe.libelle}>
            <h3 className="mb-3 text-xs font-bold tracking-wider text-ink/50 uppercase">
              {groupe.libelle}
            </h3>
            <ul className="space-y-3">
              {groupe.notifications.map((n) => (
                <li key={n.id}>
                  <NotificationItem notification={n} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full max-w-3xl flex-col px-5 pt-2 pb-6 md:min-h-0 md:px-10 md:pt-10 md:pb-12">
      <header>
        <div className="flex min-h-10 items-center justify-between gap-3">
          <h2 className="text-[28px] leading-tight font-bold text-navy md:text-[34px]">
            Notifications
          </h2>
          {nonLues > 0 && (
            <button
              type="button"
              onClick={() => toutLire()}
              disabled={enCours}
              className="shrink-0 text-sm font-semibold text-signal hover:underline disabled:opacity-60"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        <p className="mt-1.5 text-[14px] leading-snug text-ink/60">
          Restez informé en temps réel
        </p>
      </header>

      <div className="mt-5">
        <FiltresNotifications
          value={filtre}
          onChange={setFiltre}
          nonLues={nonLues}
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col">{contenu}</div>
    </div>
  );
}