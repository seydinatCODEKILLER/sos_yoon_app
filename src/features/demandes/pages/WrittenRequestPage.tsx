import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, PenLine } from "lucide-react";
import { WrittenRequestForm } from "../components/WrittenRequestForm";

export function WrittenRequestPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-paper px-6 py-8 md:px-12 md:py-12">
      {/* fonds — quadrillage + points + blob, cohérent avec le flux d'inscription */}
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

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col md:min-h-[calc(100dvh-6rem)]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 self-start text-sm font-medium text-ink/60 transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Retour
        </button>

        <div className="mt-10 text-center md:mt-14">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-signal/10 text-signal">
            <PenLine className="h-6 w-6" strokeWidth={1.75} />
          </span>

          <h1 className="mt-4 font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
            Décrivez votre urgence
          </h1>
          <p className="mt-2 text-ink/60">
            Quelques mots suffisent pour orienter votre demande.
          </p>
        </div>

        <div className="mt-8 pb-8">
          <WrittenRequestForm />
        </div>
      </div>
    </div>
  );
}