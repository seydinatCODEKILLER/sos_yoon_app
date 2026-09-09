import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Plus, ArrowRight } from "lucide-react";

export function HomeCtaCard() {
  return (
    <Link
      to="/app/demandes/nouvelle"
      className="group relative block overflow-hidden rounded-2xl bg-ink px-6 py-6 text-paper transition-colors hover:bg-ink/95"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* mini radar */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-paper/10">
            <motion.div
              className="absolute -inset-1/2"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(240,162,2,0.5) 50deg, transparent 120deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <span className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-signal">
              <Plus size={12} className="text-ink" />
            </span>
          </div>

          <div>
            <p className="font-medium">Déposer une nouvelle demande</p>
            <p className="mt-0.5 text-xs text-paper/60">
              Le bon professionnel, identifié en quelques minutes
            </p>
          </div>
        </div>

        <ArrowRight
          size={18}
          className="shrink-0 text-paper/60 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}