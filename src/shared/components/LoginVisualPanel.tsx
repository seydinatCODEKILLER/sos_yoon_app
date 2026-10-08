import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Fingerprint, ShieldCheck } from "lucide-react";

const SIGNAL = "var(--color-signal)";

const espaces = [
  "Vos demandes en cours",
  "Vos échanges",
  "Vos documents",
  "Votre profil",
];

const orbitRings = [
  { size: "88%", duration: 30, reverse: false, dot: 8, glow: 14 },
  { size: "64%", duration: 20, reverse: true, dot: 6, glow: 10 },
  { size: "42%", duration: 13, reverse: false, dot: 5, glow: 8 },
] as const;

const particles = [
  { left: "14%", top: "20%", delay: 0 },
  { left: "82%", top: "14%", delay: 0.5 },
  { left: "10%", top: "76%", delay: 1 },
  { left: "86%", top: "70%", delay: 0.3 },
  { left: "48%", top: "6%", delay: 1.5 },
];

interface LoginVisualPanelProps {
  title?: string;
  subtitle?: string;
}

export function LoginVisualPanel({
  title = "Bon retour. Votre espace vous attend.",
  subtitle = "Reprenez là où vous vous êtes arrêté : vos demandes, vos échanges et vos documents, réunis au même endroit.",
}: LoginVisualPanelProps) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % espaces.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative hidden h-full w-full flex-col justify-between overflow-hidden bg-navy md:flex">
      {/* grille */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* grande lueur orange derrière les orbites */}
      <motion.div
        className="pointer-events-none absolute top-[38%] -left-32 h-120 w-120 rounded-full bg-signal/20 blur-[120px]"
        animate={reduceMotion ? undefined : { x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* en-tête : logo + badge sécurité */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-12 pt-12"
      >
        {/* TODO : remplacer par le logo SVG officiel */}
        <span className="text-lg font-bold tracking-[0.18em] text-paper">
          SOSYOON
        </span>

        <div className="flex items-center gap-1.5 rounded-full border border-paper/10 bg-paper/5 px-3 py-1.5 backdrop-blur-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-signal" strokeWidth={1.75} />
          <span className="text-[11px] font-medium text-paper/70">
            Connexion sécurisée
          </span>
        </div>
      </motion.div>

      {/* titre */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 px-12 pt-16"
      >
        <h2 className="font-display max-w-sm text-4xl leading-[1.1] text-paper text-balance">
          {title}
        </h2>
      </motion.div>

      {/* orbites */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-12">
        <div className="relative aspect-square w-full max-w-84">
          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-paper/30"
              style={{ left: p.left, top: p.top }}
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0.2, 0.8, 0.2], y: [0, -8, 0] }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {orbitRings.map((ring, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-dashed border-signal/20"
              style={{
                width: ring.size,
                height: ring.size,
                left: "50%",
                top: "50%",
              }}
              animate={
                reduceMotion
                  ? { x: "-50%", y: "-50%" }
                  : {
                      x: "-50%",
                      y: "-50%",
                      rotate: ring.reverse ? -360 : 360,
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: ring.duration,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
            >
              {!reduceMotion && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    top: -ring.dot / 2,
                    width: ring.dot,
                    height: ring.dot * 3.5,
                    background: `linear-gradient(to bottom, ${SIGNAL}, transparent)`,
                    opacity: 0.35,
                    transformOrigin: "center top",
                    transform: ring.reverse ? "rotate(8deg)" : "rotate(-8deg)",
                  }}
                />
              )}

              <motion.span
                className="absolute left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  top: -ring.dot / 2,
                  width: ring.dot,
                  height: ring.dot,
                  background: SIGNAL,
                  boxShadow: `0 0 ${ring.glow}px 2px ${SIGNAL}`,
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }
                }
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            </motion.div>
          ))}

          {/* pulsations */}
          {!reduceMotion &&
            [0, 1.7].map((delay) => (
              <motion.span
                key={delay}
                className="absolute top-1/2 left-1/2 h-[42%] w-[42%] rounded-full border border-signal/40"
                animate={{
                  x: "-50%",
                  y: "-50%",
                  scale: [1, 1.9],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay,
                }}
              />
            ))}

          {/* emblème central */}
          <div className="absolute top-1/2 left-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-signal/40 bg-navy/80 backdrop-blur-sm">
            <div className="absolute inset-0 rounded-full bg-signal/10 blur-md" />
            <Fingerprint
              className="relative h-[45%] w-[45%] text-signal"
              strokeWidth={1.25}
            />
          </div>

          {/* libellé cyclique */}
          <div className="absolute top-full left-1/2 mt-4 -translate-x-1/2">
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-paper/10 bg-navy/80 px-3 py-1 text-[11px] text-paper/70 backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                {espaces[active]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* pied */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: [0.21, 0.47, 0.32, 0.98],
        }}
        className="relative z-10 px-12 pb-12"
      >
        <div className="max-w-md border-t border-paper/10 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-signal">
            Connexion sécurisée
          </p>
          <p className="mt-2 max-w-xs text-sm text-paper/60">{subtitle}</p>
        </div>
      </motion.div>
    </div>
  );
}