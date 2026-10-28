import type { ReactNode } from "react";
import { motion } from "motion/react";
import { apparition } from "@/shared/lib/animationsPage";

const TEINTES = {
  bleu: "border-blue-100 bg-blue-50/70",
  orange: "border-orange-100 bg-orange-50",
  violet: "border-violet-100 bg-violet-50",
  vert: "border-emerald-100 bg-emerald-50",
} as const;

interface CarteStatAdminProps {
  libelle: string;
  valeur: string;
  teinte: keyof typeof TEINTES;
  children?: ReactNode;
}

export function CarteStatAdmin({ libelle, valeur, teinte, children }: CarteStatAdminProps) {
  return (
    <motion.div variants={apparition} className={`rounded-xl border p-4 ${TEINTES[teinte]}`}>
      <p className="text-xs font-semibold text-ink/65">{libelle}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <p className="text-3xl leading-none font-bold text-ink tabular-nums">{valeur}</p>
        <div className="text-[11px] font-semibold">{children}</div>
      </div>
    </motion.div>
  );
}