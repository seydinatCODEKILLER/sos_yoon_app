import type { Variants } from "motion/react";

export const conteneur: Variants = {
  cache: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const apparition: Variants = {
  cache: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const pastille: Variants = {
  cache: { opacity: 0, scale: 0.4 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};