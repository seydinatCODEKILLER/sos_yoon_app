import { motion, useReducedMotion } from "motion/react";

function PulseRing({ delay, animate }: { delay: number; animate: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-16 rounded-full border border-signal/40"
      initial={{ scale: 1, opacity: 0 }}
      animate={
        animate ? { scale: [1, 1.8], opacity: [0.45, 0] } : { opacity: 0 }
      }
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay }}
    />
  );
}

export function SosHero({
  onClick,
  compact = false,
}: {
  onClick: () => void;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`flex flex-col items-center text-center ${
        compact ? "py-2" : "flex-1 justify-center py-6"
      }`}
    >
      <div className="relative grid size-72 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-signal/15"
        />
        <span
          aria-hidden
          className="absolute inset-8 rounded-full border border-signal/10"
        />
        <PulseRing delay={0} animate={!reduceMotion} />
        <PulseRing delay={1.6} animate={!reduceMotion} />

        <motion.button
          type="button"
          onClick={onClick}
          aria-label="SOS — Trouver un professionnel du droit"
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className="relative z-10 flex size-40 flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_30%,#ff7d22,#e8580a)] text-paper shadow-[0_0_70px_10px_rgba(249,97,13,0.35)] outline-none focus-visible:ring-4 focus-visible:ring-signal/40"
        >
          <span className="font-display text-4xl font-bold tracking-wider">
            SOS
          </span>
          <span className="mt-1 max-w-[11ch] text-balance text-[13px] leading-snug text-paper/90">
            Trouver un professionnel du droit
          </span>
        </motion.button>
      </div>

      <p className="mt-4 text-base font-semibold text-ink">
        Trouver un professionnel du droit
      </p>
      <p className="mt-1 max-w-xs text-pretty text-sm text-ink/55">
        Avocat, huissier, notaire ou juriste-conseil, près de vous
      </p>
    </div>
  );
}
