import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Lock, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AssistantCard } from "@/shared/components/AssistantCard";

function PulseRing({ delay, animate }: { delay: number; animate: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-16 rounded-full border border-signal/40"
      initial={{ scale: 1, opacity: 0 }}
      animate={animate ? { scale: [1, 1.8], opacity: [0.45, 0] } : { opacity: 0 }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay }}
    />
  );
}

export function UserHomePage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const prenom = useAuthStore((s) => s.user?.prenom);

  return (
    <div className="flex min-h-[calc(100dvh-8.5rem)] flex-col px-5 pb-4 pt-2 md:mx-auto md:min-h-[calc(100dvh-3.5rem)] md:max-w-xl md:justify-center md:px-6">
      {/* Salutation */}
      <div className="md:text-center">
        <p className="text-lg text-ink/55">
          Bonjour{prenom ? ` ${prenom}` : ""} <span aria-hidden>👋</span>
        </p>
        <h2 className="mt-2 text-balance text-[28px] font-bold leading-[1.15] text-navy md:text-4xl">
          Quelle est votre urgence aujourd'hui ?
        </h2>
      </div>

      {/* Bouton SOS */}
      <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
        <div className="relative grid size-72 place-items-center">
          <span aria-hidden className="absolute inset-0 rounded-full border border-signal/15" />
          <span aria-hidden className="absolute inset-8 rounded-full border border-signal/10" />
          <PulseRing delay={0} animate={!reduceMotion} />
          <PulseRing delay={1.6} animate={!reduceMotion} />

          <motion.button
            type="button"
            onClick={() => navigate("/app/demandes/nouvelle")}
            aria-label="SOS — Trouver un professionnel du droit"
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="relative z-10 flex size-40 flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_30%,#ff7d22,#e8580a)] text-paper shadow-[0_0_70px_10px_rgba(249,97,13,0.35)] outline-none focus-visible:ring-4 focus-visible:ring-signal/40"
          >
            <span className="font-display text-4xl font-bold tracking-wider">SOS</span>
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

      {/* Soxna Yoon */}
      <AssistantCard />

      {/* Réassurance (desktop) */}
      <p className="mt-6 hidden flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink/55 md:flex">
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
    </div>
  );
}