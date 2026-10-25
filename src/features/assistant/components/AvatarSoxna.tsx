import { motion, useReducedMotion } from "motion/react";
import type { EcranAssistant } from "../types/assistant.types";

function Pulse({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 rounded-full border border-signal/40"
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: [1, 1.25], opacity: [0.45, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay }}
    />
  );
}

export function AvatarSoxna({ ecran }: { ecran: EcranAssistant }) {
  const reduce = useReducedMotion();
  const petit = ecran === "indisponible";
  const parle = ecran === "reponse";
  const ecoute = ecran === "ecoute";

  return (
    <div
      className={`relative mx-auto grid shrink-0 place-items-center ${
        petit ? "size-44" : "size-64 sm:size-72"
      }`}
    >
      {ecoute && !reduce && (
        <>
          <Pulse delay={0} />
          <Pulse delay={1.2} />
        </>
      )}
      <img
        src="/images/soxna-yoon.png"
        alt="Soxna Yoon, assistante juridique"
        className={`relative size-full rounded-full object-cover transition-shadow duration-300 ${
          parle
            ? "shadow-[0_0_60px_rgba(249,97,13,0.35)] ring-2 ring-signal"
            : "ring-1 ring-white/10"
        }`}
      />
    </div>
  );
}
