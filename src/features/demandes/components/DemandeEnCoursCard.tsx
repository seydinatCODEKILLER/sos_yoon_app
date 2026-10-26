import { Link } from "react-router-dom";
import { Check, Clock, Send } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { DemandeResume } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { nomCourt } from "../lib/contactProfessionnel";
import { DemandeIcone } from "./DemandeIcone";
import { MiniProgression } from "./MiniProgression";
import { formatDateDemande } from "../lib/formatDateDemande";
import { CARTE_LIEN } from "@/shared/lib/styleCarte";

const BADGE =
  "h-auto gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium [&>svg]:size-4";

function BadgePhase({ demande }: { demande: DemandeResume }) {
  if (demande.phase === "ACCEPTEE" || demande.phase === "CONTACT_ETABLI") {
    const nom = demande.professionnelNom
      ? nomCourt(demande.professionnelNom)
      : "Un professionnel";
    return (
      <Badge
        variant="outline"
        className={`${BADGE} border-emerald-200 bg-emerald-50 text-emerald-700`}
      >
        <Check aria-hidden />
        {nom} a accepté
      </Badge>
    );
  }
  if (demande.phase === "PROS_NOTIFIES") {
    return (
      <Badge
        variant="outline"
        className={`${BADGE} border-sky-200 bg-sky-50 text-sky-700`}
      >
        <Clock aria-hidden />
        Recherche en cours
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className={`${BADGE} border-ink/10 bg-ink/4 text-ink/70`}
    >
      <Send aria-hidden />
      Demande envoyée
    </Badge>
  );
}

export function DemandeEnCoursCard({ demande }: { demande: DemandeResume }) {
  return (
    <Link
      to={demandeRoutes.suivi(demande.id)}
      className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-signal/40"
    >
      <Card className={`gap-0 rounded-xl border py-0 ${CARTE_LIEN}`}>
        <CardContent className="p-4">
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
        </CardContent>
      </Card>
    </Link>
  );
}