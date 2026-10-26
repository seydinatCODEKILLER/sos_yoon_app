import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Bell, Check, Clock, House } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { FondMotif } from "@/shared/components/FondMotif";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition, conteneur, pastille } from "@/shared/lib/animationsPage";

const ETAPES = [
  {
    titre: "Informations personnelles et d'exercice",
    description: "Identité, spécialités et coordonnées du cabinet enregistrées.",
  },
  {
    titre: "Documents justificatifs transmis",
    description: "Vos justificatifs ont bien été déposés.",
  },
  {
    titre: "Vérification déontologique & légale",
    description:
      "Contrôle de conformité auprès de l'ordre professionnel et certification de votre profil.",
  },
  {
    titre: "Activation de l'espace praticien",
    description:
      "Accès immédiat à la gestion de vos demandes, dossiers et clients certifiés.",
  },
] as const;

/**
 * Index de l'étape en cours (0 à 3).
 * TODO : à lire depuis le back-end (GET /pro/inscription/statut).
 */
const ETAPE_EN_COURS = 2;

type Etat = "faite" | "en-cours" | "a-venir";

function etatDe(index: number): Etat {
  if (index < ETAPE_EN_COURS) return "faite";
  if (index === ETAPE_EN_COURS) return "en-cours";
  return "a-venir";
}

function Pastille({ etat }: { etat: Etat }) {
  if (etat === "faite") {
    return (
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-full bg-emerald-500 text-white"
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (etat === "en-cours") {
    return (
      <span aria-hidden className="relative grid size-6 place-items-center">
        {/* Onde pulsante pour montrer que la vérification est active */}
        <motion.span
          className="absolute inset-0 rounded-full bg-signal/40"
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="relative grid size-6 place-items-center rounded-full bg-signal">
          <span className="size-2 rounded-full bg-white" />
        </span>
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="grid size-6 place-items-center rounded-full border-2 border-ink/10 bg-ink/5"
    >
      <span className="size-1.5 rounded-full bg-ink/20" />
    </span>
  );
}

function EtapeSuivi({
  index,
  dernier,
}: {
  index: number;
  dernier: boolean;
}) {
  const etape = ETAPES[index];
  const etat = etatDe(index);

  return (
    <motion.li
      variants={apparition}
      aria-current={etat === "en-cours" ? "step" : undefined}
      className="relative flex gap-3 pb-5 last:pb-0"
    >
      {/* Trait vers l'étape suivante */}
      {!dernier && (
        <span
          aria-hidden
          className={`absolute top-6 bottom-0 left-3 w-0.5 -translate-x-1/2 ${
            etat === "faite" ? "bg-emerald-500" : "bg-ink/10"
          }`}
        />
      )}

      <div className="relative z-10 shrink-0">
        <Pastille etat={etat} />
      </div>

      {etat === "en-cours" ? (
        <div className="min-w-0 flex-1 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-ink">{etape.titre}</p>
            <Badge className="h-auto shrink-0 rounded-md bg-signal px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
              En cours
            </Badge>
          </div>
          <p className="mt-1 text-xs leading-snug text-amber-900/70">
            {etape.description}
          </p>
        </div>
      ) : (
        <div className={`min-w-0 flex-1 ${etat === "a-venir" ? "opacity-50" : ""}`}>
          <p className="text-sm font-semibold text-ink">{etape.titre}</p>
          <p className="mt-0.5 text-xs leading-snug text-navy/60">
            {etape.description}
          </p>
        </div>
      )}
    </motion.li>
  );
}

export function ValidationDossierPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  // Tant que le dossier n'est pas validé, il n'y a pas d'espace pro à ouvrir :
  // retourner à l'accueil ferme la session.
  function allerALAccueil() {
    queryClient.clear();
    logout();
    navigate("/", { replace: true });
  }

  return (
    <FondMotif teinte="signal">
      <motion.div
        variants={conteneur}
        initial="cache"
        animate="visible"
        className="w-full max-w-xl"
      >
        <header className="text-center">
          <motion.span
            variants={pastille}
            aria-hidden
            className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 shadow-sm"
          >
            <span className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white">
              <Check className="size-5" strokeWidth={3} />
            </span>
          </motion.span>

          <motion.h1
            variants={apparition}
            className="font-display mt-5 text-4xl leading-tight font-bold text-ink"
          >
            Demande envoyée
          </motion.h1>

          <motion.p
            variants={apparition}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy/60"
          >
            Votre demande d'inscription est en cours de vérification. Notre
            équipe et les services compétents procèdent actuellement à
            l'examen de vos pièces justificatives.
          </motion.p>
        </header>

        <motion.div variants={apparition} className="mt-8">
          <Card className={`gap-0 rounded-xl border py-0 ${CARTE}`}>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/8 pb-4">
                <h2 className="text-base font-bold text-ink">
                  Statut de votre inscription
                </h2>
                <Badge
                  variant="secondary"
                  className="h-auto gap-1.5 rounded-full bg-ink/5 px-3 py-1 text-[11px] font-medium text-navy/70"
                >
                  <Clock className="size-3.5" aria-hidden />
                  Délai moyen : 24h à 48h ouvrées
                </Badge>
              </div>

              <motion.ol
                variants={conteneur}
                aria-label="Étapes de votre inscription"
                className="mt-5"
              >
                {ETAPES.map((_, i) => (
                  <EtapeSuivi key={i} index={i} dernier={i === ETAPES.length - 1} />
                ))}
              </motion.ol>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={apparition}
          role="status"
          className="mt-5 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3"
        >
          <Bell className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden />
          <p className="text-xs leading-snug text-sky-900">
            <span className="font-semibold">
              Aucune action n'est requise de votre part.
            </span>{" "}
            Vous recevrez une notification par courriel dès que la validation
            sera finalisée.
          </p>
        </motion.div>

        <motion.div variants={apparition} className="mt-8 flex justify-center">
          <Button
            type="button"
            onClick={allerALAccueil}
            className="h-11 gap-2 rounded-lg bg-navy px-6 text-sm font-semibold text-paper hover:bg-navy/90"
          >
            <House className="size-4" aria-hidden />
            Accéder à l'accueil SOS YOON
          </Button>
        </motion.div>
      </motion.div>
    </FondMotif>
  );
}