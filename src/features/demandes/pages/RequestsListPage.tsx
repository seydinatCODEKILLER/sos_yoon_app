import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  AlertCircle,
  Inbox,
  Plus,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
} from "lucide-react";
import { useMyDemandes } from "../hooks/useMyDemandes";
import { DemandeListItem } from "../components/DemandeListItem";
import { DemandeCard } from "../components/DemandeCard";
import { DemandeListSkeleton } from "../components/DemandeListSkeleton";
import {
  DemandeFilters,
  type StatutFilter,
} from "../components/DemandeFilters";
import { NeedHelpCard } from "../components/NeedHelpCard";
import { getErrorMessage } from "@/shared/lib/errorHandler";

type ViewMode = "liste" | "cartes";

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
const STATUTS_TERMINEES = ["RESOLUE", "CLOTUREE"];
const STATUTS_ANNULEES = ["ANNULEE"];

const PAGE_SIZE = 10;

export function RequestsListPage() {
  const [page, setPage] = useState(1);
  const [view, setView] = useState<ViewMode>("liste");
  const [statutFilter, setStatutFilter] = useState<StatutFilter>("TOUTES");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, isFetching } = useMyDemandes({
    page,
    limit: PAGE_SIZE,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.data.filter((demande) => {
      const matchesStatut =
        statutFilter === "TOUTES" ||
        (statutFilter === "EN_COURS" &&
          STATUTS_EN_COURS.includes(demande.statut)) ||
        (statutFilter === "TERMINEES" &&
          STATUTS_TERMINEES.includes(demande.statut)) ||
        (statutFilter === "ANNULEES" &&
          STATUTS_ANNULEES.includes(demande.statut));

      const matchesSearch =
        !search.trim() ||
        (demande.descriptionTexte ?? "")
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      return matchesStatut && matchesSearch;
    });
  }, [data, statutFilter, search]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="mx-auto max-w-4xl px-4 py-10 sm:py-14"
    >
      <motion.div
        variants={item}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-signal">
            Historique
          </p>
          <h1 className="font-display mt-2 text-2xl text-ink sm:text-3xl">
            Mes demandes
          </h1>
          {data && (
            <p className="mt-1 text-xs text-muted-foreground">
              {data.pagination.total} demande
              {data.pagination.total > 1 ? "s" : ""} au total
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center gap-0.5 rounded-lg border border-border bg-white p-0.5">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="absolute inset-y-0.5 w-7 rounded-md bg-paper"
              style={{ left: view === "liste" ? "2px" : "30px" }}
            />
            <button
              type="button"
              onClick={() => setView("liste")}
              aria-label="Vue liste"
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                view === "liste" ? "text-ink" : "text-muted-foreground/50"
              }`}
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => setView("cartes")}
              aria-label="Vue cartes"
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                view === "cartes" ? "text-ink" : "text-muted-foreground/50"
              }`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <Link
            to="/app/demandes/nouvelle"
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-signal px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal/90"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nouvelle</span>
          </Link>
        </div>
      </motion.div>

      {data && data.data.length > 0 && (
        <motion.div variants={item}>
          <DemandeFilters
            statutFilter={statutFilter}
            onStatutChange={setStatutFilter}
            search={search}
            onSearchChange={setSearch}
          />
        </motion.div>
      )}

      {isLoading && <DemandeListSkeleton view={view} />}

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
          className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-white px-4 py-16 text-center"
        >
          <Inbox className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium text-ink">
            Aucune demande pour le moment
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Déposez votre première demande, un professionnel disponible sera
            identifié automatiquement.
          </p>
          <Link
            to="/app/demandes/nouvelle"
            className="mt-2 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal/90"
          >
            Déposer une demande
          </Link>
        </motion.div>
      )}

      {data && data.data.length > 0 && filtered.length === 0 && (
        <motion.div
          variants={item}
          className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-white px-4 py-14 text-center"
        >
          <Inbox className="h-6 w-6 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Aucune demande ne correspond à ce filtre.
          </p>
        </motion.div>
      )}

      {data && filtered.length > 0 && (
        <>
          <AnimatePresence mode="wait">
            {view === "liste" ? (
              <motion.div
                key="liste"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white transition-opacity ${
                  isFetching ? "opacity-60" : ""
                }`}
              >
                {filtered.map((demande) => (
                  <DemandeListItem key={demande.id} demande={demande} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="cartes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`mt-4 grid gap-3 sm:grid-cols-2 transition-opacity ${
                  isFetching ? "opacity-60" : ""
                }`}
              >
                {filtered.map((demande) => (
                  <DemandeCard key={demande.id} demande={demande} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {data.pagination.totalPages > 1 && (
            <motion.div
              variants={item}
              className="mt-5 flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.pagination.hasPrev}
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-ink disabled:opacity-30 disabled:hover:text-muted-foreground"
              >
                <ChevronLeft size={15} />
                Précédent
              </button>
              <span className="text-xs text-muted-foreground">
                Page {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.pagination.hasNext}
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-ink disabled:opacity-30 disabled:hover:text-muted-foreground"
              >
                Suivant
                <ChevronRight size={15} />
              </button>
            </motion.div>
          )}
        </>
      )}

      {data && data.data.length > 0 && <NeedHelpCard />}
    </motion.div>
  );
}
