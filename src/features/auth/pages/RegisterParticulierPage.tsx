import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { AuthVisualPanel } from "@/shared/components/AuthVisualPanel";
import { RegisterParticulierForm } from "../components/RegisterParticulierForm";

function FloatingBadge({
  icon: Icon,
  label,
  className,
  delay = 0,
}: {
  icon: typeof ShieldCheck;
  label: string;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`pointer-events-none absolute hidden items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/60 shadow-sm md:flex ${className}`}
      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Icon className="h-3.5 w-3.5 text-signal" />
      {label}
    </motion.div>
  );
}

function FloatingDot({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`pointer-events-none absolute hidden h-2 w-2 rounded-full bg-signal/50 md:block ${className}`}
      animate={
        reduceMotion ? undefined : { y: [0, -10, 0], opacity: [0.4, 1, 0.4] }
      }
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export function RegisterParticulierPage() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen bg-paper md:grid-cols-2">
      <div className="relative hidden md:block">
        <AuthVisualPanel
          title="Décrivez votre urgence, on s'occupe du reste."
          subtitle="Votre compte particulier vous permet de déposer une demande et de suivre son traitement en temps réel."
        />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-px bg-linear-to-b from-transparent via-ink/10 to-transparent" />
        <div className="pointer-events-none absolute top-1/2 right-0 h-40 w-px -translate-y-1/2 bg-signal/40 blur-sm" />
      </div>

      <div className="relative flex flex-col overflow-x-hidden overflow-y-auto px-6 py-10 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-ink) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 rounded-full bg-signal/10 blur-[100px]"
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex items-center justify-between md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-display text-base text-ink">SOS Yoon</span>
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-ink/50 transition-colors hover:text-ink/80"
          >
            <ArrowLeft size={14} />
            Retour
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-8 right-8 z-10 hidden items-center gap-1.5 text-sm text-ink/50 transition-colors hover:text-ink/80 md:flex"
        >
          <ArrowLeft size={14} />
          Retour
        </button>

        <div className="relative z-10 flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Éléments flottants — decoratifs, desktop uniquement */}
            <FloatingBadge
              icon={ShieldCheck}
              label="Données sécurisées"
              className="-top-6 -left-8"
              delay={0}
            />
            <FloatingBadge
              icon={Sparkles}
              label="Inscription rapide"
              className="top-1/3 -right-10"
              delay={1.2}
            />
            <FloatingDot className="top-8 right-4" delay={0.5} />
            <FloatingDot className="bottom-16 -left-4" delay={1.8} />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="w-full"
            >
              <div className="text-center">
                <h1 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
                  Créez votre compte
                </h1>
                <p className="mt-2 text-ink/60">
                  Renseignez vos informations pour recevoir un code de
                  validation par SMS.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <RegisterParticulierForm />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}