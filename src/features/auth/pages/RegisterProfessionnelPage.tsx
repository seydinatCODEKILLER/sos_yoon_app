import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { AuthVisualPanel } from "@/shared/components/AuthVisualPanel";
import { RegisterProfessionnelForm } from "../components/RegisterProfessionnelForm";
import { CurvedDivider } from "@/shared/components/CurvedDivider";

export function RegisterProfessionnelPage() {
  const navigate = useNavigate();

  return (
    <div className="relative grid h-screen bg-paper md:grid-cols-2">
      <div className="relative hidden md:block">
        <AuthVisualPanel
          title="Rejoignez le réseau de professionnels du droit."
          subtitle="Recevez des demandes correspondant à votre spécialité et à votre zone d'intervention, dès que votre inscription est validée."
        />
      </div>

      <CurvedDivider />

      <div className="relative flex h-full flex-col overflow-x-hidden overflow-y-auto px-6 py-10 md:py-16">
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

        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full max-w-lg"
          >
            <div className="text-center">
              <h1 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
                Inscription professionnelle
              </h1>
              <p className="mt-2 text-ink/60">
                Complétez les 3 étapes ci-dessous pour rejoindre le réseau.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <RegisterProfessionnelForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}