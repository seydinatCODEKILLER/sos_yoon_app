import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { VoiceRecorderPanel } from "../components/VoiceRecorderPanel";

export function VoiceRequestPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-paper px-6 py-8 md:px-12 md:py-12">
      {/* fonds — quadrillage + points + blob, cohérent avec le flux de demande */}
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

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group relative z-10 flex items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Retour
      </button>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
            Décrivez votre urgence à l'oral
          </h1>
          <p className="mt-2 text-ink/60">
            Parlez librement, en français ou dans votre langue locale.
          </p>
        </div>

        <div className="mt-10">
          <VoiceRecorderPanel />
        </div>
      </div>
    </div>
  );
}