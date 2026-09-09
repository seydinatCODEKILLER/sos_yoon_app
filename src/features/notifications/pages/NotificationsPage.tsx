import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { AlertCircle, BellOff, CheckCheck } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead";
import { NotificationItem } from "../components/NotificationItem";
import { NotificationsSkeleton } from "../components/NotificationsSkeleton";
import { NotificationsStatsCard } from "../components/NotificationsStatsCard";
import { groupNotificationsByDate } from "../lib/groupNotificationsByDate";
import { getErrorMessage } from "@/shared/lib/errorHandler";
import { toast } from "@/shared/lib/toast";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

type Filter = "toutes" | "non-lues";

export function NotificationsPage() {
  const [filter, setFilter] = useState<Filter>("toutes");
  const { data, isLoading, isError, error, isFetching } = useNotifications({
    lu: filter === "non-lues" ? false : undefined,
    limit: 30,
  });
  const markAllAsRead = useMarkAllAsRead();

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate(undefined, {
      onSuccess: () => toast.success("Toutes les notifications sont lues"),
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const groups = data ? groupNotificationsByDate(data.data) : [];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="mx-auto max-w-5xl px-4 py-10 sm:py-14"
    >
      <motion.div
        variants={item}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-signal">
            Centre de notifications
          </p>
          <h1 className="font-display mt-2 flex items-center gap-2 text-2xl text-ink sm:text-3xl">
            Notifications
            {data && data.nonLues > 0 && (
              <span className="rounded-full bg-signal px-2 py-0.5 text-sm font-medium text-ink">
                {data.nonLues}
              </span>
            )}
          </h1>
        </div>

        {data && data.nonLues > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-signal hover:underline disabled:opacity-50"
          >
            <CheckCheck size={15} />
            <span className="hidden sm:inline">Tout marquer comme lu</span>
          </button>
        )}
      </motion.div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px] lg:items-start">
        {/* ── Colonne principale ─────────────────────────── */}
        <div>
          <motion.div
            variants={item}
            className="relative inline-flex gap-1 rounded-lg border border-border bg-white p-1"
          >
            {(["toutes", "non-lues"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors"
              >
                {filter === f && (
                  <motion.div
                    layoutId="notif-filter-bg"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-md bg-ink"
                  />
                )}
                <span
                  className={`relative z-10 ${
                    filter === f ? "text-paper" : "text-muted-foreground hover:text-ink"
                  }`}
                >
                  {f === "toutes" ? "Toutes" : "Non lues"}
                </span>
              </button>
            ))}
          </motion.div>

          {isLoading && <NotificationsSkeleton />}

          {isError && (
            <motion.div
              variants={item}
              className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-red-200 bg-red-50/60 px-4 py-10 text-center"
            >
              <AlertCircle className="h-6 w-6 text-red-400" />
              <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
            </motion.div>
          )}

          {data && data.data.length === 0 && (
            <motion.div
              variants={item}
              className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-white px-4 py-16 text-center"
            >
              <BellOff className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-medium text-ink">
                {filter === "non-lues"
                  ? "Aucune notification non lue"
                  : "Aucune notification"}
              </p>
            </motion.div>
          )}

          {groups.length > 0 && (
            <motion.div
              variants={item}
              className={`mt-6 space-y-6 transition-opacity ${isFetching ? "opacity-80" : ""}`}
            >
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                    {group.label}
                  </p>
                  <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
                    {group.notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Colonne latérale ───────────────────────────── */}
        {data && data.data.length > 0 && (
          <motion.div variants={item} className="lg:sticky lg:top-6">
            <NotificationsStatsCard
              notifications={data.data}
              totalNonLues={data.nonLues}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}