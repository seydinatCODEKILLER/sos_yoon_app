import { motion } from "motion/react";
import { Check } from "lucide-react";
import { getStepIndex } from "../lib/statutSteps";
import type { DemandeStatut } from "../types/demande.types";

const ETAPES = [
  {
    titre: "Analyse de votre demande",
    description: "Identification du métier et de la spécialité",
  },
  {
    titre: "Recherche du professionnel",
    description: "Disponibilité et proximité",
  },
  {
    titre: "Mise en relation",
    description: "Messagerie sécurisée",
  },
];

interface DemandeStatusStepperProps {
  statut: DemandeStatut;
}

export function DemandeStatusStepper({ statut }: DemandeStatusStepperProps) {
  const currentStep = getStepIndex(statut);
  const progressPercent = (currentStep / (ETAPES.length - 1)) * 100;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Progression
        </p>
        <p className="text-xs font-medium text-signal">
          Étape {Math.min(currentStep + 1, ETAPES.length)}/{ETAPES.length}
        </p>
      </div>

      <ol className="relative space-y-6">
        {/* ligne de fond */}
        <div className="absolute top-1 bottom-1 left-2.5 w-px bg-border" />
        {/* ligne de progression animée */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="absolute top-1 left-2.5 w-px bg-signal"
        />

        {ETAPES.map((etape, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;

          return (
            <li key={etape.titre} className="relative flex gap-3">
              <span
                className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium transition-colors ${
                  isDone || isActive
                    ? "bg-signal text-ink"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {isDone ? (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Check size={12} />
                  </motion.span>
                ) : isActive ? (
                  <span className="relative flex h-full w-full items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-50" />
                    <span className="relative">{i + 1}</span>
                  </span>
                ) : (
                  i + 1
                )}
              </span>
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDone || isActive ? "text-ink" : "text-muted-foreground"
                  }`}
                >
                  {etape.titre}
                </p>
                <p className="text-xs text-muted-foreground">
                  {etape.description}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 flex items-center gap-1 text-[11px] font-medium text-signal"
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                    </span>
                    En cours
                  </motion.p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
