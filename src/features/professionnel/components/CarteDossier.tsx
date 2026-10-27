import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition } from "@/shared/lib/animationsPage";
import { formaterDateCourte } from "../lib/formatDashboard";
import { STATUT_DOSSIER } from "../lib/statutDossier";
import type { DossierResume } from "../types/dossier.types";

interface CarteDossierProps {
  dossier: DossierResume;
  selectionne: boolean;
}

export function CarteDossier({ dossier: d, selectionne }: CarteDossierProps) {
  const statut = STATUT_DOSSIER[d.statutDossier];
  const cloture = d.statutDossier === "CLOTURE";

  return (
    <motion.li variants={apparition} className="list-none">
      <Link
        to={`/pro/dossiers/${d.demandeId}`}
        aria-current={selectionne ? "true" : undefined}
        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-signal"
      >
        <Card
          className={`gap-0 py-0 ${
            selectionne
              ? "border-signal bg-linear-to-br from-white to-signal/8 ring-1 ring-signal/30"
              : CARTE
          } ${cloture && !selectionne ? "opacity-75" : ""}`}
        >
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold text-ink/55">{d.reference}</span>
              <Badge className={`gap-1.5 border-0 text-[10px] font-semibold ${statut.classe}`}>
                <span aria-hidden className={`size-1.5 rounded-full ${statut.point}`} />
                {statut.libelle}
              </Badge>
            </div>

            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-ink">{d.citoyenNom}</p>
              <Badge
                variant="secondary"
                className="h-auto shrink-0 rounded-md bg-ink/8 px-1.5 py-0.5 text-[10px] font-medium text-ink/70"
              >
                {d.matiere}
              </Badge>
            </div>

            <p
              className={`line-clamp-2 text-xs leading-snug ${
                selectionne ? "font-medium text-signal" : "text-ink/70"
              }`}
            >
              {d.titre ?? d.matiere}
            </p>

            <p className="flex items-center gap-1.5 border-t border-ink/8 pt-2 text-[11px] text-ink/50">
              <Calendar className="size-3" aria-hidden />
              Ouvert le {formaterDateCourte(d.dateOuverture)}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.li>
  );
}