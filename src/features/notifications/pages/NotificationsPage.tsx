import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { demandeErrorMessage } from "@/features/demandes/lib/demandeErrors";
import {
  useCompteursNotifications,
  useMarquerLue,
  useNotifications,
  useToutMarquerLu,
} from "../hooks/useNotifications";
import { cibleDe, groupeParJour } from "../lib/notification";
import { FiltresNotifications } from "../components/FiltresNotifications";
import { NotificationItem } from "../components/NotificationItem";
import { NotificationsVide } from "../components/NotificationsVide";
import type {
  FiltreNotifications,
  Notification,
} from "../types/notification.types";

function Squelette() {
  return (
    <div
      className="divide-y divide-ink/6 overflow-hidden rounded-2xl border border-ink/10 bg-white"
      aria-hidden
    >
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex animate-pulse gap-3.5 px-4 py-4">
          <div className="size-11 rounded-full bg-ink/8" />
          <div className="flex-1 space-y-2.5 pt-1.5">
            <div className="h-3.5 w-2/5 rounded bg-ink/8" />
            <div className="h-3 w-4/5 rounded bg-ink/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState<FiltreNotifications>("TOUTES");
  const [page, setPage] = useState(0);

  const { data, dataUpdatedAt, error, isPlaceholderData, isFetching, refetch } =
    useNotifications(filtre, page);
  const { data: compteurs } = useCompteursNotifications();
  const { mutate: marquerLue } = useMarquerLue();
  const { mutate: toutLire, isPending: enCours } = useToutMarquerLu();

  const groupes = useMemo(
    () => (data ? groupeParJour(data.contenu, dataUpdatedAt) : []),
    [data, dataUpdatedAt],
  );

  const nonLues = compteurs?.nonLues ?? 0;

  function changerFiltre(f: FiltreNotifications) {
    setFiltre(f);
    setPage(0);
  }

  function ouvrir(n: Notification) {
    if (!n.lue) marquerLue(n.id);
    const cible = cibleDe(n);
    if (cible) navigate(cible);
  }

  let contenu: React.ReactNode;

  if (error && !data) {
    contenu = (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5"
      >
        <p className="text-sm font-semibold text-red-800">
          Les notifications ne se sont pas chargées.
        </p>
        <p className="text-sm text-red-700">{demandeErrorMessage(error)}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 border-red-200 bg-white text-red-700 hover:bg-red-100"
        >
          <RotateCw className="size-3.5" aria-hidden />
          Réessayer
        </Button>
      </div>
    );
  } else if (!data) {
    contenu = <Squelette />;
  } else if (data.contenu.length === 0) {
    contenu =
      filtre === "NON_LUES" ? (
        <NotificationsVide
          titre="Tout est à jour."
          message="Vous n'avez aucune notification non lue."
        />
      ) : (
        <NotificationsVide />
      );
  } else {
    contenu = (
      <div className="space-y-6">
        {groupes.map((g) => (
          <section key={`${filtre}-${page}-${g.cle}`} aria-label={g.libelle}>
            <h3 className="mb-2 px-1 text-[13px] font-semibold text-ink/55">
              {g.libelle}
            </h3>
            <ul className="divide-y divide-ink/6 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(26,36,51,0.04)]">
              {g.notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  maintenant={dataUpdatedAt}
                  onOuvrir={ouvrir}
                />
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toutLire()}
              disabled={enCours}
              aria-label="Tout marquer comme lu"
              className="shrink-0 font-semibold text-signal hover:bg-signal/10 hover:text-signal"
            >
              <span className="sm:hidden" aria-hidden>
                Tout lire
              </span>
              <span className="hidden sm:inline">Tout marquer comme lu</span>
            </Button>
          )}
        </div>
        <p className="mt-1.5 text-[14px] leading-snug text-ink/60">
          Les nouvelles de vos demandes, du plus récent au plus ancien.
        </p>
      </header>

      <div className="mt-5">
        <FiltresNotifications
          value={filtre}
          onChange={changerFiltre}
          compteurs={compteurs}
        />
      </div>

      <div
        className={`mt-5 flex flex-1 flex-col transition-opacity ${
          isPlaceholderData ? "opacity-60" : ""
        }`}
        aria-busy={isFetching}
      >
        {contenu}
      </div>

      {data && data.totalPages > 1 && (
        <nav
          className="mt-6 flex items-center justify-between"
          aria-label="Pagination"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="gap-1 rounded-full"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Précédent
          </Button>
          <span className="text-xs text-ink/55">
            Page {page + 1} sur {data.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page + 1 >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="gap-1 rounded-full"
          >
            Suivant
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </nav>
      )}
    </div>
  );
}