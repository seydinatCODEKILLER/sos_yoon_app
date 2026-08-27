import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { AuthVisualPanel } from "@/shared/components/AuthVisualPanel";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
  return (
    <div className="grid min-h-screen bg-ink md:grid-cols-2">
      <div className="relative hidden md:block">
        <AuthVisualPanel
          title="Rejoignez SOS Yoon en quelques secondes."
          subtitle="Créez votre compte pour déposer une demande urgente et suivre son traitement en temps réel."
        />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-px bg-linear-to-b from-transparent via-paper/15 to-transparent" />
        <div className="pointer-events-none absolute top-1/2 right-0 h-40 w-px -translate-y-1/2 bg-signal/40 blur-sm" />
      </div>

      <div className="relative flex flex-col overflow-x-hidden overflow-y-auto px-6 py-10 shadow-[inset_12px_0_24px_-20px_rgba(0,0,0,0.6)] md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-paper/3 via-transparent to-transparent" />

        {/* Pattern de points — écho des particules du panneau visuel */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-paper) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 rounded-full bg-signal/6 blur-[100px]"
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex items-center justify-between md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-display text-base text-paper">SOS Yoon</span>
          </Link>
        </div>

        <Link
          to="/"
          className="absolute top-8 right-8 z-10 hidden items-center gap-1.5 text-sm text-paper/50 transition-colors hover:text-paper/80 md:flex"
        >
          <ArrowLeft size={14} />
          Retour à l'accueil
        </Link>

        <div className="relative z-10 flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full"
          >
            <RegisterForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}