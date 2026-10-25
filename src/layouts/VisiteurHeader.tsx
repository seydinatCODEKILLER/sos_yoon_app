import { Link, useLocation, useMatches } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { LienConnexion, LienInscription } from "@/shared/components/LienConnexion";

const MotionLink = motion.create(Link);

interface RouteHandle {
  title?: string;
}

export function VisiteurHeader() {
  const { pathname } = useLocation();
  const matches = useMatches();
  const reduce = useReducedMotion();
  const accueil = pathname === "/";

  const titre = [...matches]
    .reverse()
    .map((m) => (m.handle as RouteHandle | undefined)?.title)
    .find(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 bg-paper/95 px-5 backdrop-blur md:px-10">
      <div className="flex min-w-0 items-center gap-1">
        {accueil ? (
          <MotionLink
            to="/"
            aria-label="SOS Yoon, accueil"
            className="flex items-center"
            whileHover={reduce ? undefined : { scale: 1.05 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <img
              src="/images/logo_orange.png"
              alt="SOS Yoon"
              className="h-6 w-auto"
            />
          </MotionLink>
        ) : (
          <>
            <MotionLink
              to="/"
              aria-label="Retour à l'accueil"
              className="-ml-2 grid size-11 shrink-0 place-items-center rounded-full text-navy transition-colors hover:bg-ink/5"
              initial="rest"
              animate="rest"
              whileHover={reduce ? undefined : "hover"}
              whileTap={reduce ? undefined : { scale: 0.92 }}
            >
              {/* La flèche recule d'un cran au survol */}
              <motion.span
                aria-hidden
                className="inline-flex"
                variants={{ rest: { x: 0 }, hover: { x: -3 } }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
              >
                <ArrowLeft className="size-6" />
              </motion.span>
            </MotionLink>
            <h1 className="truncate text-[17px] font-bold text-navy">{titre}</h1>
          </>
        )}
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <LienConnexion variant="pilule" />
        <LienInscription variant="pilule" />
      </div>
    </header>
  );
}