import { motion, useReducedMotion } from "motion/react";
import { Bot } from "lucide-react";

/** Affiché entre l'envoi d'une question et l'arrivée de la réponse */
export function IndicateurRechercheChatbotPro() {
  const reduire = useReducedMotion();

  return (
    <div
      role="status"
      className="flex items-center gap-3 text-sm text-ink/60"
    >
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-full bg-navy text-paper"
      >
        <Bot className="size-4" />
      </span>
      <span>Recherche en cours</span>
      <span aria-hidden className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-signal"
            animate={reduire ? undefined : { opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </span>
    </div>
  );
}