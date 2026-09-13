import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { METIERS } from "../lib/metiers";

const accentStyles = {
  signal: {
    iconBg: "bg-signal/10",
    iconText: "text-signal",
    border: "hover:border-signal/50",
    arrow: "text-signal",
    glow: "group-hover:shadow-[0_16px_40px_-16px_rgba(240,162,2,0.35)]",
  },
  brass: {
    iconBg: "bg-brass/10",
    iconText: "text-brass",
    border: "hover:border-brass/50",
    arrow: "text-brass",
    glow: "group-hover:shadow-[0_16px_40px_-16px_rgba(184,134,11,0.35)]",
  },
  ink: {
    iconBg: "bg-ink/8",
    iconText: "text-ink",
    border: "hover:border-ink/30",
    arrow: "text-ink",
    glow: "group-hover:shadow-[0_16px_40px_-16px_rgba(11,18,32,0.25)]",
  },
} as const;

export function MetierChoicePage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

function handleSelect(metier: string) {
  navigate("/demande/ecrit", { state: { metier } });
}

  return (
    <div className="min-h-dvh bg-paper px-6 py-8 md:px-12 md:py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group mb-8 flex items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Retour
      </button>

      <div className="mx-auto max-w-md md:max-w-3xl">
        <h1 className="font-display text-2xl font-semibold leading-tight text-ink md:text-4xl">
          De quel professionnel avez-vous besoin ?
        </h1>
        <p className="mt-2 text-ink/60 md:text-lg">
          Choisissez le métier qui correspond le mieux à votre situation.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {METIERS.map(({ value, label, description, icon: Icon, accent }, index) => {
            const styles = accentStyles[accent];
            return (
              <motion.button
                key={value}
                type="button"
                onClick={() => handleSelect(value)}
                initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.08 }}
                className={`group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 md:gap-4 md:p-6 ${styles.border} ${styles.glow}`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconText} transition-transform duration-200 group-hover:scale-110 md:h-12 md:w-12`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <span className="flex-1">
                  <span className="block font-display text-lg font-semibold text-ink">
                    {label}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink/60">
                    {description}
                  </span>
                </span>

                <span
                  className={`hidden items-center gap-1 text-sm font-medium ${styles.arrow} opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:flex`}
                >
                  Continuer
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}