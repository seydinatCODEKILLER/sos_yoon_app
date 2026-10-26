import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Gavel,
  Gift,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { FondMotif } from "@/shared/components/FondMotif";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition, conteneur, pastille } from "@/shared/lib/animationsPage";

// À adapter à ta route réelle du tableau de bord pro
const ROUTE_TABLEAU_DE_BORD = "/pro/tableau-de-bord";

// TODO : lire abonnement.joursRestants depuis le profil quand l'API sera branchée
const DUREE_ESSAI_JOURS = 30;

type Etape = {
  titre: string;
  description: string;
  icone: typeof Check;
  badge?: { texte: string; classe: string };
  accent: boolean;
};

const ETAPES: Etape[] = [
  {
    titre: "1. Informations d'exercice",
    description: "Identité civile, serment d'avocat et cabinet principal validés.",
    icone: Check,
    accent: false,
  },
  {
    titre: "2. Pièces probatoires",
    description: "Attestation d'inscription à l'Ordre et carte professionnelle certifiées.",
    icone: Check,
    accent: false,
  },
  {
    titre: "3. Contrôle déontologique",
    description: "Inscription vérifiée au Grand Tableau officiel du Barreau.",
    icone: Gavel,
    badge: { texte: "APPROUVÉ", classe: "bg-emerald-100 text-emerald-700" },
    accent: true,
  },
  {
    titre: "4. Activation de l'Espace",
    description: "Outils de téléconsultation, télétransmission et honoraires ouverts.",
    icone: Sparkles,
    badge: { texte: "ACTIF", classe: "bg-signal text-white" },
    accent: true,
  },
];

export function ProfilValidePage() {
  return (
    <FondMotif teinte="succes">
      <motion.div
        variants={conteneur}
        initial="cache"
        animate="visible"
        className="flex w-full max-w-2xl flex-col items-center text-center"
      >
        {/* Médaille avec halo pulsant */}
        <motion.div variants={pastille} className="relative mb-6 grid size-24 place-items-center">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-emerald-400/30"
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="absolute inset-3 rounded-full bg-emerald-100" />
          <span className="relative grid size-14 place-items-center rounded-full bg-emerald-700 text-white shadow-lg">
            <BadgeCheck className="size-7" />
          </span>
        </motion.div>

        <motion.h1
          variants={apparition}
          className="text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          Félicitations ! Votre profil est validé
        </motion.h1>

        <motion.p variants={apparition} className="mt-3 max-w-xl text-sm text-ink/70 sm:text-base">
          Vos pièces justificatives ont été vérifiées avec succès auprès du Barreau du Sénégal et de
          nos services. Votre Espace Professionnel SOS Yoon est désormais opérationnel et votre
          essai gratuit de {DUREE_ESSAI_JOURS} jours commence dès maintenant.
        </motion.p>

        <motion.div variants={apparition} className="mt-8 w-full text-left">
          <Card className={`${CARTE} py-0`}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-ink">
                  Cycle de validation institutionnelle
                </h2>
                <span className="text-[11px] font-bold tracking-wide text-emerald-700">
                  CONFORMITÉ 100 % ATTESTÉE
                </span>
              </div>

              <motion.ul
                variants={conteneur}
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {ETAPES.map((etape) => {
                  const Icone = etape.icone;
                  return (
                    <motion.li
                      key={etape.titre}
                      variants={apparition}
                      className="flex min-h-24 items-start gap-3 rounded-xl bg-ink/5 p-3"
                    >
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full ${
                          etape.accent
                            ? etape.badge?.texte === "ACTIF"
                              ? "bg-signal text-white"
                              : "bg-emerald-700 text-white"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <Icone className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                          {etape.titre}
                          {etape.badge && (
                            <Badge className={`border-0 text-[10px] ${etape.badge.classe}`}>
                              {etape.badge.texte}
                            </Badge>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-ink/65">{etape.description}</p>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Essai gratuit */}
        <motion.div
          variants={apparition}
          className="mt-5 flex w-full items-center gap-4 rounded-xl border border-signal/25 bg-linear-to-br from-signal/10 to-white p-4 text-left shadow-sm"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-signal text-white">
            <Gift className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
              {DUREE_ESSAI_JOURS} jours d'essai gratuit
              <Badge className="border-0 bg-signal text-[10px] font-bold text-white uppercase">
                Offert
              </Badge>
            </p>
            <p className="mt-0.5 text-xs leading-snug text-ink/65">
              Profitez de toutes les fonctionnalités de votre espace sans rien payer pendant{" "}
              {DUREE_ESSAI_JOURS} jours. L'abonnement ne démarre qu'à la fin de cette période.
            </p>
          </div>
        </motion.div>

        <motion.div variants={apparition} className="mt-8 flex flex-col items-center gap-2">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link to={ROUTE_TABLEAU_DE_BORD} replace />}
            className="h-12 rounded-xl bg-signal px-6 font-semibold text-white hover:bg-signal/90"
          >
            <LayoutDashboard className="size-5" />
            Accéder à mon Tableau de bord
            <ArrowRight className="size-4" />
          </Button>

          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link to="/" replace />}
            className="text-xs font-semibold text-ink/70"
          >
            <ArrowLeft className="size-4" />
            Retour à l'accueil SOS YOON
          </Button>
        </motion.div>
      </motion.div>
    </FondMotif>
  );
}