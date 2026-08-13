import { motion, type Variants } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { RadarPulse } from "./RadarPulse";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

// motif morse de "SOS" : point point point / trait trait trait / point point point
const morsePattern = [
  "dot",
  "dot",
  "dot",
  "gap",
  "dash",
  "dash",
  "dash",
  "gap",
  "dot",
  "dot",
  "dot",
] as const;

function MorseSignal() {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {morsePattern.map((unit, i) =>
        unit === "gap" ? (
          <span key={i} className="w-1.5" />
        ) : (
          <motion.span
            key={i}
            className={`h-0.75 rounded-full bg-signal ${
              unit === "dash" ? "w-4" : "w-1.5"
            }`}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
          />
        ),
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      {/* texture grille façon écran radar, sur toute la section */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* vignette pour recentrer le regard */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent,var(--color-ink)_75%)]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.div variants={item} className="mb-6 flex items-center gap-3">
            <MorseSignal />
            <span className="text-[11px] uppercase tracking-[0.2em] text-paper/35">
              S · O · S
            </span>
          </motion.div>

          <motion.div variants={item}>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-signal">
              SOS Yoon
            </p>
            <div className="my-2 h-px w-12 bg-linear-to-r from-brass to-transparent" />
            <p className="text-xs uppercase tracking-widest text-paper/50">
              Urgence juridique
            </p>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-4xl leading-tight md:text-6xl"
          >
            Le bon professionnel du droit,
            <br />
            en quelques minutes.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-lg text-paper/80"
          >
            Avocat, huissier, notaire ou juriste-conseil : décrivez votre
            situation, nous trouvons le professionnel disponible le plus proche
            — automatiquement.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button size="lg" className="bg-signal text-ink hover:bg-signal/90">
              Décrire mon urgence
            </Button>
            <a
              href="#comment-ca-marche"
              className="text-sm text-paper/70 underline underline-offset-4 hover:text-paper"
            >
              Comment ça marche
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <RadarPulse />
        </motion.div>
      </div>
    </section>
  );
}
