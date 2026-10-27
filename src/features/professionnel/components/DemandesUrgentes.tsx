import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, CircleAlert, Inbox } from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition } from "@/shared/lib/animationsPage";
import { useAccepterSollicitation } from "../hooks/useAccepterSollicitation";
import { ilYa, initiales } from "../lib/formatDashboard";
import type { SollicitationResume } from "../types/dashboard.types";
import {
  DialogAcceptation,
  type AcceptationAffichee,
} from "./DialogAcceptation";

const AVATARS = [
  "bg-orange-100 text-orange-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
];

const MESSAGES_ERREUR: Record<string, string> = {
  SOLLICITATION_EXPIREE: "Cette demande a expiré.",
  DEMANDE_DEJA_AFFECTEE: "Un autre professionnel a déjà accepté cette demande.",
};

interface DemandesUrgentesProps {
  demandes: SollicitationResume[] | null;
  total: number;
  /** Horodatage de la dernière récupération (dataUpdatedAt) */
  maintenant: number;
}

export function DemandesUrgentes({
  demandes,
  total,
  maintenant,
}: DemandesUrgentesProps) {
  const accepter = useAccepterSollicitation();
  const [erreur, setErreur] = useState<string | null>(null);
  const [acceptation, setAcceptation] = useState<AcceptationAffichee | null>(
    null,
  );
  const enCours = accepter.isPending ? accepter.variables : null;

  async function onAccepter(d: SollicitationResume) {
    setErreur(null);
    try {
      const resultat = await accepter.mutateAsync(d.id);
      setAcceptation({ resultat, objet: d.extrait });
    } catch (e) {
      const err = e as Partial<ApiErreur>;
      setErreur(
        (err.code && MESSAGES_ERREUR[err.code]) ??
          err.message ??
          "Impossible d'accepter la demande.",
      );
    }
  }

  return (
    <motion.section variants={apparition}>
      <Card className={`${CARTE} h-full py-0`}>
        <CardContent className="flex min-h-80 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
              <span aria-hidden className="size-2 rounded-full bg-signal" />
              Demandes urgentes en attente
            </h2>
            {demandes && total > 0 && (
              <Badge className="border-0 bg-signal/15 text-xs font-semibold text-signal">
                {total} à traiter
              </Badge>
            )}
          </div>

          {erreur && (
            <p
              role="alert"
              className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              <CircleAlert className="size-4 shrink-0" aria-hidden />
              {erreur}
            </p>
          )}

          {!demandes ? (
            <div className="mt-4 space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-ink/5"
                />
              ))}
            </div>
          ) : demandes.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-ink/5 text-ink/50">
                <Inbox className="size-6" aria-hidden />
              </span>
              <p className="text-sm font-semibold text-ink">
                Aucune demande en attente
              </p>
              <p className="max-w-xs text-xs text-ink/60">
                Les nouvelles demandes correspondant à votre profil apparaîtront
                ici.
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-ink/8">
              {demandes.map((d, i) => (
                <li
                  key={d.id}
                  className="flex flex-col gap-3 py-3 first:pt-0 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                      aria-hidden
                      className={`grid size-10 shrink-0 place-items-center rounded-lg text-xs font-bold ${AVATARS[i % AVATARS.length]}`}
                    >
                      {initiales(d.citoyen.affichage)}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                        {d.citoyen.affichage}
                        <Badge
                          variant="secondary"
                          className="h-auto rounded-md bg-ink/8 px-1.5 py-0.5 text-[10px] font-medium text-ink/70"
                        >
                          {d.matiere}
                        </Badge>
                      </p>
                      <p className="line-clamp-1 text-xs text-ink/75">
                        « {d.extrait} »
                      </p>
                      <p className="text-[11px] text-ink/50">
                        Reçu {ilYa(d.recueLe, maintenant)} ·{" "}
                        {d.libelleLocalisation}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 pl-13 sm:pl-0">
                    <Button
                      type="button"
                      size="sm"
                      disabled={enCours !== null}
                      onClick={() => onAccepter(d)}
                      className="h-8 rounded-md bg-signal px-4 text-xs font-semibold text-white hover:bg-signal/90"
                    >
                      {enCours === d.id ? "Acceptation…" : "Accepter"}
                    </Button>
                    {/* Le refus demande un motif : il se fait depuis le détail de la demande */}
                    <Button
                      size="sm"
                      variant="ghost"
                      nativeButton={false}
                      render={<Link to={`/pro/demandes/${d.id}`} />}
                      className="h-8 px-3 text-xs text-ink/60"
                    >
                      Refuser
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto border-t border-ink/8 pt-3">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link to="/pro/demandes" />}
              className="h-auto w-full justify-between px-0 text-xs font-semibold text-signal hover:bg-transparent hover:underline"
            >
              Voir toutes les demandes en attente{demandes ? ` (${total})` : ""}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </CardContent>
      </Card>
      <DialogAcceptation
        acceptation={acceptation}
        restantes={Math.max(0, total - 0)}
        onFermer={() => setAcceptation(null)}
      />
    </motion.section>
  );
}
