import { Link } from "react-router-dom";
import { ChevronRight, Radio } from "lucide-react";
import { STATUT_LABELS, STATUT_BADGE_STYLES } from "../lib/statutLabels";
import type { Demande } from "../types/demande.types";

interface DemandeListItemProps {
  demande: Demande;
}

const METIER_LABELS: Record<string, string> = {
  AVOCAT: "Avocat",
  HUISSIER: "Huissier",
  NOTAIRE: "Notaire",
  JURISTE_CONSEIL: "Juriste-conseil",
};

const STATUTS_EN_COURS = [
  "ENVOYEE",
  "ANALYSE_EN_COURS",
  "RECHERCHE_PROFESSIONNEL",
  "EN_ATTENTE_ACCEPTATION",
];

export function DemandeListItem({ demande }: DemandeListItemProps) {
  const isEnCours = STATUTS_EN_COURS.includes(demande.statut);

  return (
    <Link
      to={`/app/demandes/${demande.id}`}
      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper/60"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUT_BADGE_STYLES[demande.statut]}`}
          >
            {STATUT_LABELS[demande.statut]}
          </span>
          {isEnCours && (
            <Radio size={10} className="animate-pulse text-signal" />
          )}
          {demande.metierIdentifie && (
            <span className="text-xs text-muted-foreground">
              {METIER_LABELS[demande.metierIdentifie] ??
                demande.metierIdentifie}
            </span>
          )}
        </div>

        <p className="mt-1.5 truncate text-sm text-ink">
          {demande.descriptionTexte ?? "Message vocal"}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(demande.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <ChevronRight
        size={16}
        className="shrink-0 text-muted-foreground/40 transition-colors group-hover:text-signal"
      />
    </Link>
  );
}
