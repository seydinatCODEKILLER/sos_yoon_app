import { motion } from "motion/react";
import { CalendarClock, CreditCard } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition } from "@/shared/lib/animationsPage";
import { useAbonnementPro } from "../hooks/useAbonnementPro";
import {
  DUREE_ESSAI_JOURS,
  formaterDateLongue,
  formaterMontant,
} from "../lib/formatDashboard";
import type { AbonnementPro } from "../types/dashboard.types";

function etatAffiche(a: AbonnementPro) {
  if (a.suspendu || a.statut === "EXPIRE") {
    return { libelle: "Expiré", classe: "bg-red-100 text-red-700" };
  }
  if (a.statut === "ESSAI") {
    return { libelle: "Essai gratuit", classe: "bg-signal/15 text-signal" };
  }
  return { libelle: "Actif", classe: "bg-emerald-100 text-emerald-700" };
}

export function CarteAbonnement() {
  const { data: a } = useAbonnementPro();

  const essai = a?.statut === "ESSAI" && !a.suspendu;
  const restants = a?.joursRestants ?? 0;
  const progression = essai
    ? Math.min(100, Math.max(0, ((DUREE_ESSAI_JOURS - restants) / DUREE_ESSAI_JOURS) * 100))
    : 100;
  const etat = a ? etatAffiche(a) : null;
  const echeance = essai ? a?.finEssai : a?.finPeriode;

  return (
    <motion.section variants={apparition}>
      <Card className={`${CARTE} h-full py-0`}>
        <CardContent className="flex min-h-80 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
              <span aria-hidden className="size-2 rounded-full bg-sky-500" />
              Abonnement
            </h2>
            {etat && (
              <Badge className={`border-0 text-xs font-semibold ${etat.classe}`}>
                {etat.libelle}
              </Badge>
            )}
          </div>

          {!a ? (
            <div className="mt-6 space-y-3">
              <div className="h-10 w-40 animate-pulse rounded-md bg-ink/10" />
              <div className="h-3 animate-pulse rounded-full bg-ink/10" />
              <div className="h-16 animate-pulse rounded-xl bg-ink/5" />
            </div>
          ) : (
            <div className="mt-6 flex flex-1 flex-col gap-5">
              <div>
                {essai ? (
                  <p className="text-4xl font-bold tracking-tight text-ink">
                    {restants}{" "}
                    <span className="text-base font-semibold text-ink/60">
                      jour{restants > 1 ? "s" : ""} restant{restants > 1 ? "s" : ""}
                    </span>
                  </p>
                ) : (
                  <p className="text-4xl font-bold tracking-tight text-ink">
                    {formaterMontant(a.montantMensuel, a.devise)}
                    <span className="text-base font-semibold text-ink/60"> / mois</span>
                  </p>
                )}

                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progression)}
                  className="mt-4 h-2.5 overflow-hidden rounded-full bg-ink/10"
                >
                  <motion.div
                    className={`h-full rounded-full ${a.suspendu || a.statut === "EXPIRE" ? "bg-red-500" : essai ? "bg-signal" : "bg-emerald-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progression}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <ul className="space-y-3 text-sm">
                {echeance && (
                  <li className="flex items-center gap-3 rounded-xl bg-ink/5 p-3">
                    <CalendarClock className="size-5 shrink-0 text-ink/50" aria-hidden />
                    <span className="text-ink/75">
                      {essai ? "Fin de l'essai gratuit le " : "Prochaine échéance le "}
                      <span className="font-semibold text-ink">
                        {formaterDateLongue(echeance)}
                      </span>
                    </span>
                  </li>
                )}
                <li className="flex items-center gap-3 rounded-xl bg-ink/5 p-3">
                  <CreditCard className="size-5 shrink-0 text-ink/50" aria-hidden />
                  <span className="text-ink/75">
                    {essai ? "Ensuite : " : "Tarif : "}
                    <span className="font-semibold text-ink">
                      {formaterMontant(a.montantMensuel, a.devise)} / mois
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
}