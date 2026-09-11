import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Fingerprint, ShieldCheck } from "lucide-react";

const espaces = [
  "Vos demandes en cours",
  "Vos échanges",
  "Vos documents",
  "Votre profil",
];

const orbitRings = [
  {
    size: "88%",
    duration: 30,
    reverse: false,
    color: "signal",
    dot: 8,
    glow: 14,
  },
  {
    size: "64%",
    duration: 20,
    reverse: true,
    color: "brass",
    dot: 6,
    glow: 10,
  },
  {
    size: "42%",
    duration: 13,
    reverse: false,
    color: "signal",
    dot: 5,
    glow: 8,
  },
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
  subtitle = "Reprennez là où vous vous êtes arrêté : vos demandes, vos échanges et vos documents, réunis au même endroit.",
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
    <div className="relative hidden h-full w-full flex-col justify-between overflow-hidden bg-ink md:flex">
      {/* grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* blobs ambiants — positions inversées vs register */}
      <motion.div
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-signal/10 blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brass/10 blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* badge sécurité — écho au formulaire register */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-8 right-8 z-10 flex items-center gap-1.5 rounded-full border border-paper/15 bg-paper/5 px-3 py-1.5 backdrop-blur-sm"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-brass" strokeWidth={1.75} />
        <span className="text-[11px] font-medium text-paper/70">
          Connexion sécurisée
        </span>
      </motion.div>

      {/* en-tête */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 px-10 pt-12"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-signal">
          SOS Yoon
        </p>
        <h2 className="font-display mt-3 max-w-xs text-2xl leading-snug text-paper text-balance">
          {title}
        </h2>
      </motion.div>

      {/* orbes */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-10">
        <div className="relative aspect-square w-full max-w-90">
          {/* particules flottantes */}
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

          {/* anneaux en rotation lente, directions alternées, chaque satellite avec sa propre identité */}
          {orbitRings.map((ring, i) => {
            const dotColor =
              ring.color === "signal"
                ? "var(--color-signal)"
                : "var(--color-brass)";
            return (
              <motion.div
                key={i}
                className="absolute rounded-full border border-dashed border-paper/15"
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
                {/* traînée lumineuse derrière le satellite */}
                {!reduceMotion && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      top: -ring.dot / 2,
                      width: ring.dot,
                      height: ring.dot * 3.5,
                      background: `linear-gradient(to bottom, ${dotColor}, transparent)`,
                      opacity: 0.35,
                      transformOrigin: "center top",
                      transform: ring.reverse
                        ? "rotate(8deg)"
                        : "rotate(-8deg)",
                    }}
                  />
                )}

                {/* satellite avec pulsation subtile */}
                <motion.span
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    top: -ring.dot / 2,
                    width: ring.dot,
                    height: ring.dot,
                    background: dotColor,
                    boxShadow: `0 0 ${ring.glow}px 2px ${dotColor}99`,
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
            );
          })}

          {/* pulsations d'accueil — écho du beacon de la page d'accueil */}
          {!reduceMotion && (
            <>
              <motion.span
                className="absolute top-1/2 left-1/2 h-[42%] w-[42%] rounded-full border border-brass/50"
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
                }}
              />
              <motion.span
                className="absolute top-1/2 left-1/2 h-[42%] w-[42%] rounded-full border border-brass/50"
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
                  delay: 1.7,
                }}
              />
            </>
          )}

          {/* emblème central : empreinte = votre espace personnel */}
          <div className="absolute top-1/2 left-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brass/40 bg-ink/80 backdrop-blur-sm">
            <div className="absolute inset-0 rounded-full bg-brass/10 blur-md" />
            <Fingerprint
              className="relative h-[45%] w-[45%] text-brass"
              strokeWidth={1.25}
            />
          </div>

          {/* libellé cyclique — écho des métiers du register, adapté à l'espace connecté */}
          <div className="absolute top-full left-1/2 mt-4 -translate-x-1/2">
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="whitespace-nowrap rounded-full border border-paper/15 bg-ink/70 px-3 py-1 text-[11px] text-paper/70 backdrop-blur-sm"
              >
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
        className="relative z-10 px-10 pb-12"
      >
        <p className="text-xs uppercase tracking-widest text-paper/40">
          Connexion sécurisée
        </p>
        <p className="mt-2 max-w-xs text-sm text-paper/60">{subtitle}</p>
      </motion.div>
    </div>
  );
}
