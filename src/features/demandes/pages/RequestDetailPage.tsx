import { useParams, Link } from "react-router-dom";
import { motion, type Variants } from "motion/react";
import { ArrowLeft, AlertCircle, Radio, Quote } from "lucide-react";
import { useDemande } from "../hooks/useDemande";
import { DemandeStatusStepper } from "../components/DemandeStatusStepper";
import { ProfessionnelCard } from "../components/ProfessionnelCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { STATUT_LABELS, STATUT_BADGE_STYLES } from "../lib/statutLabels";
import { getErrorMessage } from "@/shared/lib/errorHandler";

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

const URGENCE_STYLES: Record<string, string> = {
  FAIBLE: "bg-muted text-muted-foreground",
  MOYENNE: "bg-amber-100 text-amber-700",
  ELEVEE: "bg-red-100 text-red-700",
};

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: demande, isLoading, isError, error } = useDemande(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-4 h-8 w-64" />
        <Skeleton className="mt-2 h-3 w-40" />
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_300px]">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !demande) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
        <p className="text-sm text-muted-foreground">
          {error ? getErrorMessage(error) : "Demande introuvable"}
        </p>
        <Link
          to="/app/demandes"
          className="mt-4 inline-block text-sm font-medium text-signal hover:underline"
        >
          Retour à mes demandes
        </Link>
      </div>
    );
  }

  const isProfessionnelConfirme = demande.statut !== "EN_ATTENTE_ACCEPTATION";
  const isEnCours = !["RESOLUE", "CLOTUREE", "ANNULEE"].includes(demande.statut);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="mx-auto max-w-4xl px-4 py-10 sm:py-14"
    >
      <motion.div variants={item}>
        <Link
          to="/app/demandes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} />
          Mes demandes
        </Link>
      </motion.div>

      <motion.div
        variants={item}
        className="mt-4 flex flex-wrap items-start justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl text-ink sm:text-3xl">
              Suivi de la demande
            </h1>
            {isEnCours && (
              <Radio size={12} className="animate-pulse text-signal" />
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Déposée le{" "}
            {new Date(demande.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUT_BADGE_STYLES[demande.statut]}`}
          >
            {STATUT_LABELS[demande.statut]}
          </span>
          {demande.urgence && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                URGENCE_STYLES[demande.urgence] ?? URGENCE_STYLES.FAIBLE
              }`}
            >
              Urgence {demande.urgence.toLowerCase()}
            </span>
          )}
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* ── Colonne principale ─────────────────────────── */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-border bg-white p-6"
        >
          {demande.descriptionTexte && (
            <div className="mb-6 flex gap-2.5 rounded-lg bg-paper px-4 py-3.5">
              <Quote size={14} className="mt-0.5 shrink-0 text-signal/60" />
              <p className="text-sm italic text-ink">
                {demande.descriptionTexte}
              </p>
            </div>
          )}

          <DemandeStatusStepper statut={demande.statut} />
        </motion.div>

        {/* ── Colonne latérale ───────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          {demande.professionnel ? (
            <motion.div variants={item}>
              <ProfessionnelCard
                professionnel={demande.professionnel}
                confirmed={isProfessionnelConfirme}
              />
            </motion.div>
          ) : (
            <motion.div
              variants={item}
              className="rounded-2xl border border-dashed border-border bg-paper/60 p-5 text-center"
            >
              <p className="text-sm font-medium text-ink">
                Recherche en cours
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Un professionnel disponible vous sera proposé sous peu.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}