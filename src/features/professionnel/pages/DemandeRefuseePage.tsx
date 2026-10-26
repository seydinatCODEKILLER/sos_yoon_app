import { motion } from "motion/react";
import { CircleAlert, Clock, House, SquarePen } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { FondMotif } from "@/shared/components/FondMotif";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition, conteneur, pastille } from "@/shared/lib/animationsPage";
import { Link } from "react-router-dom";

// À adapter à ta route réelle de resoumission
const ROUTE_RESOUMISSION = "/pro/resoumission";

// TODO : remplacer par la réponse de GET /pro/inscription/statut
const MOTIF_MOCK = {
  motif:
    "Les documents professionnels fournis ne permettent pas de confirmer votre inscription professionnelle auprès du Barreau du Sénégal.",
  pieceEnCause: "Carte Professionnelle ou Attestation d'inscription expirée ou illisible.",
};

export function DemandeRefuseePage() {
  const { motif, pieceEnCause } = MOTIF_MOCK;

  return (
    <FondMotif teinte="alerte">
      <motion.div
        variants={conteneur}
        initial="cache"
        animate="visible"
        className="flex w-full max-w-2xl flex-col items-center text-center"
      >
        <motion.div variants={pastille} className="relative mb-6 grid size-24 place-items-center">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-red-400/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="absolute inset-3 rounded-full bg-red-100" />
          <span className="relative grid size-14 place-items-center rounded-full bg-red-600 text-white shadow-lg">
            <CircleAlert className="size-7" />
          </span>
        </motion.div>

        <motion.h1
          variants={apparition}
          className="text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          Demande non approuvée
        </motion.h1>

        <motion.p variants={apparition} className="mt-3 max-w-lg text-sm text-ink/70 sm:text-base">
          Votre demande d'inscription n'a pas pu être validée par nos équipes et l'Ordre
          professionnel lors de l'examen de vos pièces justificatives.
        </motion.p>

        <motion.div variants={apparition} className="mt-8 w-full text-left">
          <Card className={`${CARTE} py-0`}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-4">
                <h2 className="text-base font-semibold text-ink">
                  Motif de non-approbation &amp; Statut
                </h2>
                <Badge className="border-0 bg-red-100 text-xs font-medium text-red-700">
                  Action requise pour validation
                </Badge>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
                  <Clock className="size-4" />
                </span>
                <div className="min-w-0 space-y-3">
                  <p className="text-sm font-semibold text-ink">{motif}</p>

                  {pieceEnCause && (
                    <p className="rounded-lg border border-red-100 bg-white px-3 py-2 text-xs text-ink/70">
                      <span className="font-bold text-red-800">Pièce en cause : </span>
                      {pieceEnCause}
                    </p>
                  )}

                  <p className="text-xs text-ink/65">
                    Vous pouvez corriger vos informations, déposer des documents à jour et soumettre
                    à nouveau votre demande afin de finaliser votre inscription.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={apparition} className="mt-8 flex flex-col items-center gap-2">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link to={ROUTE_RESOUMISSION} />}
            className="h-12 rounded-xl bg-navy px-6 font-semibold text-white hover:bg-navy/90"
          >
            <SquarePen className="size-4" />
            Corriger et renvoyer mes documents
          </Button>

          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link to="/" replace />}
            className="text-xs font-medium text-ink/70"
          >
            <House className="size-4" />
            Retour à l'accueil SOS YOON
          </Button>
        </motion.div>
      </motion.div>
    </FondMotif>
  );
}