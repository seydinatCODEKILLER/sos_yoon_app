import { Link } from "react-router-dom";
import { Check, Clock, Send } from "lucide-react";
import type { DemandeResume } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { nomCourt } from "../lib/contactProfessionnel";
import { DemandeIcone } from "./DemandeIcone";
import { MiniProgression } from "./MiniProgression";
import { formatDateDemande } from "../lib/formatDateDemande";

function BadgePhase({ demande }: { demande: DemandeResume }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium";

  if (demande.phase === "ACCEPTEE" || demande.phase === "CONTACT_ETABLI") {
    const nom = demande.professionnelNom
      ? nomCourt(demande.professionnelNom)
      : "Un professionnel";
    return (
      <span className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700`}>
        <Check className="size-4" aria-hidden />
        {nom} a accepté
      </span>
    );
  }
  if (demande.phase === "PROS_NOTIFIES") {
    return (
      <span className={`${base} border-sky-200 bg-sky-50 text-sky-700`}>
        <Clock className="size-4" aria-hidden />
        Recherche en cours
      </span>
    );
  }
  return (
    <span className={`${base} border-ink/10 bg-ink/4 text-ink/70`}>
      <Send className="size-4" aria-hidden />
      Demande envoyée
    </span>
  );
}

export function DemandeEnCoursCard({ demande }: { demande: DemandeResume }) {
  return (
    <Link
      to={demandeRoutes.suivi(demande.id)}
      className="block rounded-2xl border border-ink/8 bg-white p-4 shadow-sm transition-colors hover:bg-ink/2"
    >
      <div className="flex items-center gap-3">
        <DemandeIcone titre={demande.titre} />
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-navy">
            {demande.titre}
          </p>
          <p className="text-[13px] text-ink/60">
            {formatDateDemande(demande.dateCreation)}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <BadgePhase demande={demande} />
      </div>

      <div className="mt-4">
        <MiniProgression phase={demande.phase} />
      </div>
    </Link>
  );
}