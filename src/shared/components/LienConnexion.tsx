import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { LogIn, UserPlus } from "lucide-react";

const MotionLink = motion.create(Link);

const BASE =
  "items-center justify-center gap-2 font-semibold shadow-sm outline-none transition-[color,background-color,border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-signal/40";

const TONS = {
  // Fond blanc, contour fin
  clair:
    "border border-navy/15 bg-white text-navy hover:border-signal/40 hover:text-signal hover:shadow-md",
  // Fond bleu marine plein
  marque:
    "border border-navy bg-navy text-paper hover:bg-navy/90 hover:shadow-md",
} as const;

const TAILLES = {
  // En-tête, desktop uniquement
  pilule: "hidden h-10 shrink-0 rounded-full px-5 text-sm md:inline-flex",
  // Dans la page, mobile et web
  bloc: "inline-flex h-12 w-full rounded-xl text-[15px]",
} as const;

type Variant = keyof typeof TAILLES;

interface LienAnimeProps {
  to: string;
  variant: Variant;
  ton: keyof typeof TONS;
  icone: ReactNode;
  children: ReactNode;
}

function LienAnime({ to, variant, ton, icone, children }: LienAnimeProps) {
  const reduce = useReducedMotion();
  const pilule = variant === "pilule";

  return (
    <MotionLink
      to={to}
      className={`${TAILLES[variant]} ${BASE} ${TONS[ton]}`}
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      variants={{
        rest: { y: 0, scale: 1 },
        hover: { y: pilule ? -1 : -2, scale: pilule ? 1.03 : 1.01 },
      }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      {/* L'icône glisse vers la droite quand on survole le lien */}
      <motion.span
        aria-hidden
        className="inline-flex"
        variants={{ rest: { x: 0 }, hover: { x: 4 } }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
      >
        {icone}
      </motion.span>
      {children}
    </MotionLink>
  );
}

const TAILLE_ICONE: Record<Variant, string> = {
  pilule: "size-4",
  bloc: "size-[18px]",
};

export function LienConnexion({ variant }: { variant: Variant }) {
  return (
    <LienAnime
      to="/login"
      variant={variant}
      ton="clair"
      icone={<LogIn className={TAILLE_ICONE[variant]} />}
    >
      Se connecter
    </LienAnime>
  );
}

export function LienInscription({ variant }: { variant: Variant }) {
  return (
    <LienAnime
      to="/register"
      variant={variant}
      ton="marque"
      icone={<UserPlus className={TAILLE_ICONE[variant]} />}
    >
      Créer un compte
    </LienAnime>
  );
}