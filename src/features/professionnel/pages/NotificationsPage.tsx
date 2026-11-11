import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  BellOff,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toApiErreur } from "@/shared/lib/apiError";
import { CarteNotification } from "../components/CarteNotification";
import {
  useCompteursNotifications,
  useMarquerNotificationLue,
  useNotifications,
  useToutMarquerLu,
} from "../hooks/useNotifications";
import { cibleDe, grouperParJour } from "../lib/notifications";
import type {
  FiltreNotifications,
  Notification,
} from "../types/notification.types";

const ONGLETS: { valeur: FiltreNotifications; libelle: string }[] = [
  { valeur: "TOUTES", libelle: "Toutes" },
  { valeur: "NON_LUES", libelle: "Non lues" },
];

function Squelette() {
  return (
    <div
      className="divide-y divide-ink/6 overflow-hidden rounded-2xl border border-ink/10 bg-white"
      aria-hidden
    >
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex animate-pulse gap-3.5 px-5 py-4">
          <div className="size-10 rounded-full bg-ink/8" />
          <div className="flex-1 space-y-2.5 pt-1">
            <div className="h-3.5 w-2/5 rounded bg-ink/8" />
            <div className="h-3 w-4/5 rounded bg-ink/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationsProfessionnelPage() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState<FiltreNotifications>("TOUTES");
  const [page, setPage] = useState(0);

  const { data, dataUpdatedAt, isError, error, isPlaceholderData, refetch, isFetching } =
    useNotifications(filtre, page);
  const { data: compteurs } = useCompteursNotifications();
  const marquerLue = useMarquerNotificationLue();
  const toutLire = useToutMarquerLu();

  const groupes = useMemo(
    () => (data ? grouperParJour(data.contenu, dataUpdatedAt) : []),
    [data, dataUpdatedAt],
  );

  function changerFiltre(f: FiltreNotifications) {
    setFiltre(f);
    setPage(0);
  }

  function ouvrir(n: Notification) {
    if (!n.lue) marquerLue.mutate(n.id);
    const cible = cibleDe(n);
    if (cible) navigate(cible);
  }

  const nonLues = compteurs?.nonLues ?? 0;
  const nombreDe = (f: FiltreNotifications) =>
    f === "TOUTES" ? compteurs?.toutes : compteurs?.nonLues;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-6"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Notifications
          </h2>
          <p className="max-w-md text-sm text-ink/60">
            Nouvelles demandes, dossiers et rappels d'abonnement, du plus récent
            au plus ancien.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          disabled={nonLues === 0 || toutLire.isPending}
          onClick={() => toutLire.mutate()}
          className="h-9 gap-2 self-start rounded-full px-3.5 text-[13px] font-semibold text-navy hover:bg-navy/8 disabled:text-ink/35 sm:self-auto"
        >
          <CheckCheck className="size-4" aria-hidden />
          {toutLire.isPending ? "En cours…" : "Tout marquer comme lu"}
        </Button>
      </header>

      <div
        className="inline-flex gap-1 rounded-full bg-ink/5 p-1"
        role="group"
        aria-label="Filtrer les notifications"
      >
        {ONGLETS.map((o) => {
          const actif = o.valeur === filtre;
          const nombre = nombreDe(o.valeur);
          return (
            <button
              key={o.valeur}
              type="button"
              aria-pressed={actif}
              onClick={() => changerFiltre(o.valeur)}
              className={`flex h-8 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-signal/50 ${
                actif
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              {o.libelle}
              {nombre !== undefined && (
                <span
                  className={`min-w-5 rounded-full px-1.5 text-center text-[11px] leading-5 ${
                    o.valeur === "NON_LUES" && nombre > 0
                      ? "bg-signal text-white"
                      : "bg-ink/8 text-ink/55"
                  }`}
                >
                  {nombre}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        className={`space-y-6 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
        aria-busy={isFetching}
      >
        {isError && !data ? (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5"
          >
            <p className="text-sm font-semibold text-red-800">
              Les notifications ne se sont pas chargées.
            </p>
            <p className="text-sm text-red-700">
              {toApiErreur(error).message}
            </p>
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
        ) : !data ? (
          <Squelette />
        ) : groupes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink/15 bg-white/60 px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-ink/5">
              <BellOff className="size-5 text-ink/40" aria-hidden />
            </span>
            <p className="text-sm font-semibold text-ink">
              {filtre === "NON_LUES"
                ? "Vous êtes à jour"
                : "Aucune notification pour le moment"}
            </p>
            <p className="max-w-xs text-sm text-ink/55">
              {filtre === "NON_LUES"
                ? "Toutes vos notifications ont été lues."
                : "Vos nouvelles demandes et rappels d'abonnement apparaîtront ici."}
            </p>
          </div>
        ) : (
          groupes.map((g) => (
            <section key={`${filtre}-${page}-${g.cle}`} aria-label={g.titre}>
              <h3 className="mb-2 px-1 text-[13px] font-semibold text-ink/55">
                {g.titre}
              </h3>
              <ul className="divide-y divide-ink/6 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(26,36,51,0.04)]">
                {g.notifications.map((n) => (
                  <CarteNotification
                    key={n.id}
                    notification={n}
                    maintenant={dataUpdatedAt}
                    onOuvrir={ouvrir}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      {data && data.totalPages > 1 && (
        <nav
          className="flex items-center justify-between"
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
    </motion.div>
  );
}