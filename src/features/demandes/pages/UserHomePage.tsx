import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, FolderOpen, Lock, ShieldCheck } from "lucide-react";
import { AssistantFab } from "@/features/assistant/components/AssistantFab";

function PulseRing({ delay, animate }: { delay: number; animate: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-14.5 rounded-full border border-signal/40"
      initial={{ scale: 1, opacity: 0 }}
      animate={
        animate ? { scale: [1, 1.9], opacity: [0.45, 0] } : { opacity: 0 }
      }
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay }}
    />
  );
}

export function UserHomePage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-4 text-center md:min-h-[calc(100dvh-3.5rem)] md:justify-center">

      <h2 className="mt-8 text-balance font-display text-4xl font-bold leading-[1.1] text-navy sm:text-5xl">
        Quelle est votre urgence aujourd'hui ?
      </h2>
      <p className="mt-5 max-w-lg text-pretty text-base text-ink/55">
        Décrivez votre situation, on s'occupe de vous mettre en relation
        immédiate avec le bon professionnel assermenté.
      </p>

      {/* Bouton SOS */}
      <div className="relative mt-10 grid size-64 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-signal/15"
        />
        <span
          aria-hidden
          className="absolute inset-7 rounded-full border border-signal/10"
        />
        <PulseRing delay={0} animate={!reduceMotion} />
        <PulseRing delay={1.6} animate={!reduceMotion} />

        <motion.button
          type="button"
          onClick={() => navigate("/app/demandes/nouvelle")}
          aria-label="SOS — Trouver un professionnel du droit"
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className="relative z-10 flex size-35 flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_30%,#ff7d22,#e8580a)] text-paper shadow-[0_0_70px_10px_rgba(249,97,13,0.35)] outline-none focus-visible:ring-4 focus-visible:ring-signal/40"
        >
          <span className="font-display text-3xl font-bold tracking-wider">
            SOS
          </span>
          <span className="mt-1 max-w-[11ch] text-balance text-[13px] leading-snug text-paper/90">
            Trouver un professionnel du droit
          </span>
        </motion.button>
      </div>

      {/* Accès aux demandes */}
      <Link
        to="/app/demandes"
        className="group mt-10 flex w-full max-w-md items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-left shadow-sm transition-shadow hover:shadow-md"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink/5 text-ink/70">
          <FolderOpen className="size-4.5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium text-ink">
            Vos demandes en cours
          </span>
          <span className="block text-xs text-ink/50">
            Suivi en direct avec votre professionnel de permanence
          </span>
        </span>
        <ArrowRight className="size-4 text-signal transition-transform group-hover:translate-x-0.5" />
      </Link>

      {/* Réassurance */}
      <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink/55">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-signal" aria-hidden />
          Avocats &amp; Huissiers assermentés
        </span>
        <span aria-hidden className="size-1 rounded-full bg-ink/25" />
        <span className="inline-flex items-center gap-1.5">
          <Lock className="size-3.5 text-signal" aria-hidden />
          100% Confidentiel
        </span>
      </p>

      <AssistantFab />
    </div>
  );
}
