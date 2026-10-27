import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BellOff, CheckCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
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

export function NotificationsProfessionnelPage() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState<FiltreNotifications>("TOUTES");
  const [page, setPage] = useState(0);

  const { data, dataUpdatedAt, isError } = useNotifications(filtre, page);
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
  const onglets: {
    valeur: FiltreNotifications;
    libelle: string;
    nombre?: number;
  }[] = [
    { valeur: "TOUTES", libelle: "Toutes", nombre: compteurs?.toutes },
    { valeur: "NON_LUES", libelle: "Non lues", nombre: compteurs?.nonLues },
  ];

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-6"
    >
      <motion.header
        variants={apparition}
        className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Notifications &amp; Journal d'activité
          </h2>
          <p className="max-w-xl text-sm text-ink/60">
            Nouvelles demandes et rappels d'abonnement SOS Yoon en temps réel.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={nonLues === 0 || toutLire.isPending}
          onClick={() => toutLire.mutate()}
          className="h-10 gap-2 self-start rounded-full border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800 disabled:border-ink/10 disabled:bg-ink/5 disabled:text-ink/40 disabled:shadow-none"
        >
          <CheckCheck className="size-4" aria-hidden />
          {toutLire.isPending ? "En cours…" : "Tout marquer comme lu"}
          {nonLues > 0 && !toutLire.isPending && (
            <span className="rounded-full bg-emerald-600 px-1.5 text-[11px] leading-5 font-bold text-white">
              {nonLues}
            </span>
          )}
        </Button>
      </motion.header>

      <motion.div
        variants={apparition}
        className="inline-flex gap-1 rounded-xl bg-ink/5 p-1"
        role="group"
        aria-label="Filtrer les notifications"
      >
        {onglets.map((o) => {
          const actif = o.valeur === filtre;
          return (
            <Button
              key={o.valeur}
              type="button"
              size="sm"
              variant="ghost"
              aria-pressed={actif}
              onClick={() => changerFiltre(o.valeur)}
              className={`h-8 gap-2 rounded-lg px-3 text-xs font-semibold ${
                actif
                  ? "bg-white text-ink shadow-sm hover:bg-white"
                  : "text-ink/65"
              }`}
            >
              {o.libelle}
              {o.nombre !== undefined && (
                <span
                  className={`rounded-full px-1.5 text-[11px] ${
                    o.valeur === "NON_LUES" && o.nombre > 0
                      ? "bg-signal text-white"
                      : "bg-ink/10 text-ink/60"
                  }`}
                >
                  {o.nombre}
                </span>
              )}
            </Button>
          );
        })}
      </motion.div>

      <motion.div variants={apparition} className="space-y-4">
        {isError ? (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            Impossible de charger les notifications. Réessayez dans un instant.
          </p>
        ) : !data ? (
          Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-ink/5" />
          ))
        ) : groupes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink/15 py-14 text-center">
            <BellOff className="size-8 text-ink/30" aria-hidden />
            <p className="text-sm font-semibold text-ink">
              {filtre === "NON_LUES"
                ? "Aucune notification non lue"
                : "Aucune notification"}
            </p>
            <p className="text-xs text-ink/55">
              Elles apparaîtront ici dès qu'il y aura du nouveau.
            </p>
          </div>
        ) : (
          groupes.map((g) => (
            <section
              key={`${filtre}-${page}-${g.cle}`}
              className="space-y-2"
              aria-label={g.titre}
            >
              <header className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-wide text-ink uppercase">
                  <span
                    className="size-1.5 rounded-full bg-signal"
                    aria-hidden
                  />
                  {g.titre}
                </h3>
                <span className="text-xs text-ink/50">{g.date}</span>
              </header>
              <motion.ul
                variants={conteneur}
                initial="cache"
                animate="visible"
                className="space-y-2"
              >
                {g.notifications.map((n) => (
                  <CarteNotification
                    key={n.id}
                    notification={n}
                    maintenant={dataUpdatedAt}
                    onOuvrir={ouvrir}
                  />
                ))}
              </motion.ul>
            </section>
          ))
        )}
      </motion.div>

      {data && data.totalPages > 1 && (
        <motion.nav
          variants={apparition}
          className="flex items-center justify-between"
          aria-label="Pagination"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
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
          >
            Suivant
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </motion.nav>
      )}
    </motion.div>
  );
}
