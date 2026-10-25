import { motion, useReducedMotion } from "motion/react";

const HAUTEURS = [
  6, 10, 16, 10, 22, 14, 28, 18, 34, 22, 30, 16, 26, 38, 24, 32, 32, 24, 38, 26,
  16, 30, 22, 34, 18, 28, 14, 22, 10, 16, 10, 6,
];

export function Onde({ active }: { active: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="flex h-10 items-center gap-0.75">
      {HAUTEURS.map((hauteur, i) => (
        <motion.span
          key={i}
          className={`w-0.75 rounded-full ${i % 3 === 0 ? "bg-orange-300" : "bg-signal"}`}
          style={{ height: hauteur }}
          animate={
            active && !reduce
              ? { scaleY: [0.35, 1, 0.55, 0.9, 0.35] }
              : { scaleY: 1 }
          }
          transition={{
            duration: 1.1 + (i % 5) * 0.12,
            repeat: active ? Infinity : 0,
            delay: i * 0.03,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}