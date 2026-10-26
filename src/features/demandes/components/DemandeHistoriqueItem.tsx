import { Link } from "react-router-dom";
import { Check, ChevronRight, Clock, X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { DemandeResume, StatutListe } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { DemandeIcone } from "./DemandeIcone";
import { formatDateDemande } from "../lib/formatDateDemande";
import { CARTE_LIEN } from "@/shared/lib/styleCarte";

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
  const statut =
    STATUTS[demande.statut as keyof typeof STATUTS] ?? STATUTS.TERMINEE;
  const { Icone } = statut;

  return (
    <Link
      to={demandeRoutes.suivi(demande.id)}
      className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-signal/40"
    >
      <Card className={`gap-0 rounded-xl border py-0 ${CARTE_LIEN}`}>
        {" "}
        <CardContent className="flex items-center gap-3 p-4">
          <DemandeIcone titre={demande.titre} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-navy">
              {demande.titre}
            </p>
            <p className="text-[13px] text-ink/60">
              {formatDateDemande(demande.dateCreation)}
            </p>
            <Badge
              variant="outline"
              className={`mt-1.5 h-auto gap-1 rounded-md px-2 py-0.5 text-xs font-medium [&>svg]:size-3.5 ${statut.classe}`}
            >
              <Icone aria-hidden />
              {statut.libelle}
            </Badge>
          </div>
          <ChevronRight
            className="size-5 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </CardContent>
      </Card>
    </Link>
  );
}
