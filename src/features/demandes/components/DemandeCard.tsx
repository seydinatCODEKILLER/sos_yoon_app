import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Radio,
  Scale,
  Gavel,
  Stamp,
  BookOpen,
} from "lucide-react";
import { STATUT_LABELS, STATUT_BADGE_STYLES } from "../lib/statutLabels";
import type { Demande } from "../types/demande.types";

interface DemandeCardProps {
  demande: Demande;
}

const METIER_LABELS: Record<string, string> = {
  AVOCAT: "Avocat",
  HUISSIER: "Huissier",
  NOTAIRE: "Notaire",
  JURISTE_CONSEIL: "Juriste-conseil",
};

const METIER_ICONS: Record<string, typeof Scale> = {
  AVOCAT: Scale,
  HUISSIER: Gavel,
  NOTAIRE: Stamp,
  JURISTE_CONSEIL: BookOpen,
};

const STATUTS_EN_COURS = [
  "ENVOYEE",
  "ANALYSE_EN_COURS",
  "RECHERCHE_PROFESSIONNEL",
  "EN_ATTENTE_ACCEPTATION",
];

export function DemandeCard({ demande }: DemandeCardProps) {
  const isEnCours = STATUTS_EN_COURS.includes(demande.statut);
  const MetierIcon = demande.metierIdentifie
    ? METIER_ICONS[demande.metierIdentifie]
    : null;

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/app/demandes/${demande.id}`}
        className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition-colors hover:border-signal/40"
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUT_BADGE_STYLES[demande.statut]}`}
          >
            {STATUT_LABELS[demande.statut]}
          </span>
          {isEnCours && (
            <Radio size={11} className="mt-0.5 animate-pulse text-signal" />
          )}
        </div>

        <p className="mt-3 line-clamp-3 flex-1 text-sm text-ink">
          {demande.descriptionTexte ?? "Message vocal"}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {MetierIcon && <MetierIcon size={12} />}
            <span>
              {demande.metierIdentifie
                ? (METIER_LABELS[demande.metierIdentifie] ??
                  demande.metierIdentifie)
                : "Analyse en cours"}
            </span>
          </div>
          <ArrowUpRight
            size={14}
            className="text-muted-foreground/40 transition-colors group-hover:text-signal"
          />
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground/70">
          {new Date(demande.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </Link>
    </motion.div>
  );
}
