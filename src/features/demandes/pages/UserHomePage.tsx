import { Link } from "react-router-dom";
import { motion, type Variants } from "motion/react";
import {
  Sun,
  Moon,
  Sunset,
  Inbox,
  BellOff,
  Scale,
  Gavel,
  Stamp,
  BookOpen,
} from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMyDemandes } from "../hooks/useMyDemandes";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { DemandeListItem } from "../components/DemandeListItem";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import { ActiveDemandeBanner } from "../components/ActiveDemandeBanner";
import { HomeCtaCard } from "../components/HomeCtaCard";
import { Skeleton } from "@/shared/components/ui/skeleton";

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

const STATUTS_EN_COURS = [
  "ENVOYEE",
  "ANALYSE_EN_COURS",
  "RECHERCHE_PROFESSIONNEL",
  "EN_ATTENTE_ACCEPTATION",
];

const metiers = [
  { label: "Avocat", icon: Scale },
  { label: "Huissier", icon: Gavel },
  { label: "Notaire", icon: Stamp },
  { label: "Juriste-conseil", icon: BookOpen },
];

function getGreeting(): { text: string; Icon: typeof Sun } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Bonjour", Icon: Sun };
  if (hour < 18) return { text: "Bon après-midi", Icon: Sunset };
  return { text: "Bonsoir", Icon: Moon };
}

export function UserHomePage() {
  const user = useAuthStore((s) => s.user);
  const { text: greeting, Icon: GreetingIcon } = getGreeting();

  const { data: demandesData, isLoading: demandesLoading } = useMyDemandes({
    limit: 4,
  });
  const { data: notifData, isLoading: notifLoading } = useNotifications({
    lu: false,
    limit: 4,
  });

  const activeDemande = demandesData?.data.find((d) =>
    STATUTS_EN_COURS.includes(d.statut),
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="mx-auto max-w-5xl px-4 py-10 sm:py-16"
    >
      {/* ── Bloc accueil : resserré et centré ─────────────── */}
      <div className="mx-auto max-w-2xl">
        <motion.div variants={item} className="text-center sm:text-left">
          <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-signal/15 text-signal">
            <GreetingIcon size={16} />
          </span>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">
            {greeting}
            {user ? `, ${user.prenom}` : ""}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Une situation urgente ? Décrivez-la, on s'occupe du reste.
          </p>
        </motion.div>

        {!demandesLoading && activeDemande && (
          <motion.div variants={item} className="mt-6">
            <ActiveDemandeBanner demande={activeDemande} />
          </motion.div>
        )}

        <motion.div variants={item} className="mt-6">
          <HomeCtaCard />
        </motion.div>
      </div>

      {/* ── Listes : côte à côte sur grand écran ──────────── */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Demandes récentes */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">
              Demandes récentes
            </h2>
            <Link
              to="/app/demandes"
              className="text-xs font-medium text-signal hover:underline"
            >
              Tout voir
            </Link>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-white">
            {demandesLoading ? (
              <div className="divide-y divide-border">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-24 rounded-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : demandesData && demandesData.data.length > 0 ? (
              <div className="divide-y divide-border">
                {demandesData.data.map((demande) => (
                  <DemandeListItem key={demande.id} demande={demande} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <Inbox className="h-6 w-6 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Aucune demande pour le moment
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Notifications non lues */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">
              Notifications non lues
            </h2>
            <Link
              to="/app/notifications"
              className="text-xs font-medium text-signal hover:underline"
            >
              Tout voir
            </Link>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-white">
            {notifLoading ? (
              <div className="divide-y divide-border">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-4">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifData && notifData.data.length > 0 ? (
              <div className="divide-y divide-border">
                {notifData.data.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <BellOff className="h-6 w-6 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Rien de nouveau à signaler
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bande de confiance */}
      <motion.div
        variants={item}
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
      >
        {metiers.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5"
          >
            <Icon size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
