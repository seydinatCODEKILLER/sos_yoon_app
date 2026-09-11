import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type AmbientBackgroundProps = {
  /** Décor additionnel propre à la page (ex : icônes flottantes) */
  children?: ReactNode;
  /** Centre de la zone "épargnée" par le pattern (ex : "50% 45%") */
  maskCenter?: string;
};

export function AmbientBackground({
  children,
  maskCenter = "50% 45%",
}: AmbientBackgroundProps) {
  const reduceMotion = useReducedMotion();

  const mask = `radial-gradient(ellipse 62% 55% at ${maskCenter}, transparent 35%, black 100%)`;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [--bubble:2.5rem] md:[--bubble:3.25rem]">
      {/* pattern de points — masqué au centre pour laisser respirer le contenu */}
      <div
        className="absolute inset-0 opacity-[0.06] bg-size-[18px_18px] md:opacity-[0.1] md:bg-size-[24px_24px]"
        style={
          {
            backgroundImage:
              "radial-gradient(var(--color-ink) 1px, transparent 1px)",
            maskImage: mask,
            WebkitMaskImage: mask,
          } as CSSProperties
        }
      />

      {/* blobs ambiants */}
      <motion.div
        className="absolute -left-16 -top-16 h-60 w-60 rounded-full bg-signal/10 blur-[70px] md:-left-10 md:-top-10 md:h-96 md:w-96 md:blur-[110px]"
        animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, 16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-brass/10 blur-[70px] md:-bottom-10 md:-right-10 md:h-80 md:w-80 md:blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, -20, 0], y: [0, -12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {children}
    </div>
  );
}

/* ---------- Icône flottante (uniquement pour les pages qui en veulent) ---------- */

export type FloatingIconProps = {
  icon: LucideIcon;
  top: string;
  left: string;
  delay: number;
  duration: number;
  className?: string;
};

export function FloatingIcon({
  icon: Icon,
  top,
  left,
  delay,
  duration,
  className = "",
}: FloatingIconProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute items-center justify-center rounded-full border border-ink/10 bg-white/60 text-ink/25 shadow-sm backdrop-blur-sm ${className}`}
      style={{ top, left, width: "var(--bubble)", height: "var(--bubble)" }}
      animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Icon className="h-1/2 w-1/2" strokeWidth={1.5} />
    </motion.div>
  );
}