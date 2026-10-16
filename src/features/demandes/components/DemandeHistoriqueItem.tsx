import { Link } from "react-router-dom";
import { Check, ChevronRight, Clock, X } from "lucide-react";
import type { DemandeResume, StatutListe } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { DemandeIcone } from "./DemandeIcone";
import { formatDateDemande } from "../lib/formatDateDemande";

const STATUTS: Record<
  Exclude<StatutListe, "EN_COURS">,
  { libelle: string; classe: string; Icone: typeof Check }
> = {
  TERMINEE: {
    libelle: "Terminée",
    classe: "border-ink/10 bg-ink/4 text-ink/70",
    Icone: Check,
  },
  SANS_REPONSE: {
    libelle: "Aucune réponse",
    classe: "border-amber-200 bg-amber-50 text-amber-700",
    Icone: Clock,
  },
  ANNULEE: {
    libelle: "Annulée",
    classe: "border-ink/10 bg-ink/4 text-ink/70",
    Icone: X,
  },
};

export function DemandeHistoriqueItem({ demande }: { demande: DemandeResume }) {
  // Une demande « en cours » n'arrive jamais ici ; repli par sécurité
  const statut = STATUTS[demande.statut as keyof typeof STATUTS] ?? STATUTS.TERMINEE;
  const { Icone } = statut;

  return (
    <Link
      to={demandeRoutes.suivi(demande.id)}
      className="flex items-center gap-3 rounded-xl border border-ink/8 bg-white p-4 shadow-sm transition-colors hover:bg-ink/2"
    >
      <DemandeIcone titre={demande.titre} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-navy">{demande.titre}</p>
        <p className="text-[13px] text-ink/60">
          {formatDateDemande(demande.dateCreation)}
        </p>
        <span
          className={`mt-1.5 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${statut.classe}`}
        >
          <Icone className="size-3.5" aria-hidden />
          {statut.libelle}
        </span>
      </div>
      <ChevronRight className="size-5 shrink-0 text-ink/30" aria-hidden />
    </Link>
  );
}