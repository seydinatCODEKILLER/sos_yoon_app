import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Scale, Gavel, Stamp, BookOpen, type LucideIcon } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface Metier {
  label: string;
  icon: LucideIcon;
  angle: number; // degrés, 0 = droite, -90 = haut
}

const metiers: Metier[] = [
  { label: "Avocat", icon: Scale, angle: -90 },
  { label: "Notaire", icon: Stamp, angle: 0 },
  { label: "Huissier", icon: Gavel, angle: 90 },
  { label: "Juriste-conseil", icon: BookOpen, angle: 180 },
];

const RADIUS = 34; // % du conteneur
const SIGNAL = "var(--color-signal)";
const SIGNAL_SOFT = "rgba(249, 97, 13, 0.3)"; // = signal à 30 %

function positionOf(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: 50 + RADIUS * Math.cos(rad),
    y: 50 + RADIUS * Math.sin(rad),
  };
}

const particles = [
  { left: "12%", top: "22%", delay: 0 },
  { left: "85%", top: "18%", delay: 0.6 },
  { left: "18%", top: "78%", delay: 1.1 },
  { left: "88%", top: "72%", delay: 0.3 },
  { left: "50%", top: "8%", delay: 1.6 },
];

interface AuthVisualPanelProps {
  title?: string;
  subtitle?: string;
}

export function AuthVisualPanel({
  title = "Le bon professionnel du droit, en quelques minutes.",
  subtitle = "Votre compte particulier vous permet de déposer une demande et de suivre son traitement en temps réel auprès d'officiers et auxiliaires de justice agréés.",
}: AuthVisualPanelProps) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % metiers.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const target = positionOf(metiers[active].angle);

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

      {/* lueur orange en haut à gauche (visible sur les maquettes) */}
      <motion.div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-signal/25 blur-[110px]"
        animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* halo diffus derrière le radar */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[110px]" />

      {/* en-tête : logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-12 pt-12"
      >
        <BrandLogo />
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

      {/* radar */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-12">
        <div className="relative aspect-square w-full max-w-84">
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

          {/* disque extérieur teinté + anneaux intérieurs */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/30"
            style={{
              width: "85%",
              height: "85%",
              background:
                "radial-gradient(circle, transparent 35%, rgba(249,97,13,0.14) 100%)",
            }}
          />
          {["62%", "40%"].map((size) => (
            <div
              key={size}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/20"
              style={{ width: size, height: size }}
            />
          ))}

          {/* balayage radar */}
          {!reduceMotion && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
              style={{ width: "85%", height: "85%" }}
            >
              <motion.div
                className="absolute -inset-1/2"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(249,97,13,0.28) 22deg, transparent 70deg)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}

          {/* ligne vers le professionnel trouvé */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <motion.line
              key={active}
              x1={50}
              y1={50}
              x2={target.x}
              y2={target.y}
              stroke={SIGNAL}
              strokeWidth={0.6}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </svg>

          {/* emblème central : balance de justice */}
          <div
            className="absolute top-1/2 left-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-signal bg-navy/90 backdrop-blur-sm"
            style={{ boxShadow: "0 0 24px 2px rgba(249,97,13,0.35)" }}
          >
            <div className="absolute inset-0 rounded-full bg-signal/10 blur-md" />
            <Scale
              className="relative h-[40%] w-[40%] text-signal"
              strokeWidth={1.5}
            />
          </div>

          {/* nœuds : les 4 métiers */}
          {metiers.map((metier, i) => {
            const pos = positionOf(metier.angle);
            const isActive = i === active;
            const Icon = metier.icon;
            return (
              <motion.div
                key={metier.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.12 : 1,
                    borderColor: isActive ? SIGNAL : SIGNAL_SOFT,
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border bg-navy/90 shadow-lg backdrop-blur-sm"
                >
                  {isActive && !reduceMotion && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/30" />
                  )}
                  <Icon
                    size={16}
                    className={isActive ? "text-signal" : "text-signal/60"}
                  />
                </motion.div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-full left-1/2 mt-2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-signal/30 bg-navy/90 px-2.5 py-1 text-[10px] text-signal"
                    >
                      <span className="size-1.5 rounded-full bg-signal" />
                      {metier.label} · disponible
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
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
          <p className="text-[11px] font-semibold uppercase tracking-widest text-paper/60">
            Avocat · Huissier · Notaire · Juriste-conseil
          </p>
          <p className="mt-2 max-w-sm text-sm text-paper/60">{subtitle}</p>
        </div>
      </motion.div>
    </div>
  );
}