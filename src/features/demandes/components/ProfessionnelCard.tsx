import { motion } from "motion/react";
import { Phone, Briefcase, CheckCircle2, Clock } from "lucide-react";
import type { ProfessionnelSummary } from "../types/demande.types";

interface ProfessionnelCardProps {
  professionnel: ProfessionnelSummary;
  confirmed?: boolean;
}

const METIER_LABELS: Record<string, string> = {
  AVOCAT: "Avocat",
  HUISSIER: "Huissier",
  NOTAIRE: "Notaire",
  JURISTE_CONSEIL: "Juriste-conseil",
};

export function ProfessionnelCard({
  professionnel,
  confirmed = false,
}: ProfessionnelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`overflow-hidden rounded-2xl border ${
        confirmed ? "border-signal/40 bg-white" : "border-signal/30 bg-signal/5"
      }`}
    >
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-signal">
            Professionnel identifié
          </p>
          {confirmed ? (
            <span className="flex items-center gap-1 rounded-full bg-signal/15 px-2 py-0.5 text-[11px] font-medium text-signal">
              <CheckCircle2 size={11} />
              Confirmé
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              <Clock size={11} />
              En attente
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-base text-paper">
            {!confirmed && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/30" />
            )}
            <span className="relative">
              {professionnel.user.prenom[0]}
              {professionnel.user.nom[0]}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {professionnel.user.prenom} {professionnel.user.nom}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Briefcase size={11} />
              {METIER_LABELS[professionnel.metier] ?? professionnel.metier}
              {professionnel.specialite ? ` · ${professionnel.specialite}` : ""}
            </div>
          </div>
        </div>

        {professionnel.user.telephone && (
          <a
            href={`tel:${professionnel.user.telephone}`}
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-signal/30 bg-paper py-2.5 text-sm font-medium text-ink transition-colors hover:bg-signal/10"
          >
            <Phone size={14} />
            {professionnel.user.telephone}
          </a>
        )}
      </div>

      <p
        className={`px-5 py-2.5 text-center text-xs ${
          confirmed
            ? "border-t border-signal/20 bg-signal/5 text-signal"
            : "border-t border-border bg-paper text-muted-foreground"
        }`}
      >
        {confirmed
          ? "Ce professionnel a confirmé votre demande"
          : "En attente de sa confirmation"}
      </p>
    </motion.div>
  );
}
