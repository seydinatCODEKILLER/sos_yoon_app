import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { apparition } from "@/shared/lib/animationsPage";
import { formaterNombre } from "../lib/formatAdmin";

const TEINTES = {
  bleu: { carte: "border-blue-100 bg-blue-50/70", icone: "bg-blue-100 text-blue-700" },
  orange: { carte: "border-orange-100 bg-orange-50", icone: "bg-orange-100 text-signal" },
  violet: { carte: "border-violet-100 bg-violet-50", icone: "bg-violet-100 text-violet-700" },
  vert: { carte: "border-emerald-100 bg-emerald-50", icone: "bg-emerald-100 text-emerald-700" },
} as const;

/**
 * Le nombre « monte » jusqu'à sa valeur à l'arrivée, puis glisse de l'ancienne à la nouvelle valeur
 * à chaque actualisation (toutes les minutes). Sans animation si l'utilisateur la réduit.
 */
function NombreAnime({ valeur }: { valeur: number }) {
  const reduit = useReducedMotion();
  const courant = useMotionValue(reduit ? valeur : 0);
  const texte = useTransform(courant, (v) => formaterNombre(Math.round(v)));

  useEffect(() => {
    if (reduit) {
      courant.set(valeur);
      return;
    }
    const lecture = animate(courant, valeur, { duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] });
    return () => lecture.stop();
  }, [valeur, reduit, courant]);

  return <motion.span>{texte}</motion.span>;
}

interface CarteStatAdminProps {
  libelle: string;
  valeur: number;
  teinte: keyof typeof TEINTES;
  icone: ReactNode;
  /** Écran détaillé : toute la carte devient cliquable. */
  vers?: string;
  children?: ReactNode;
}

export function CarteStatAdmin({ libelle, valeur, teinte, icone, vers, children }: CarteStatAdminProps) {
  const t = TEINTES[teinte];
  const titre = vers ? (
    <Link
      to={vers}
      className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-signal"
    >
      {libelle}
    </Link>
  ) : (
    libelle
  );

  return (
    <motion.div
      variants={apparition}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={`group relative rounded-xl border p-4 transition-shadow hover:shadow-md ${t.carte}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-ink/65">{titre}</p>
        <motion.span
          aria-hidden
          whileHover={{ rotate: -8, scale: 1.1 }}
          className={`grid size-8 shrink-0 place-items-center rounded-lg ${t.icone}`}
        >
          {icone}
        </motion.span>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <p className="text-3xl leading-none font-bold text-ink tabular-nums">
          <NombreAnime valeur={valeur} />
        </p>
        <div className="text-[11px] font-semibold">{children}</div>
      </div>
    </motion.div>
  );
}