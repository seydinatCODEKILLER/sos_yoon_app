import { motion } from "motion/react";
import { Mic, Filter, Handshake, Radar } from "lucide-react";
import { AnimatedSection } from "@/shared/components/AnimatedSection";
import { StaggerGroup, StaggerItem } from "@/shared/components/StaggerGroup";
import { Highlighter } from "@/shared/components/ui/highlighter";

const steps = [
  {
    number: "01",
    icon: Mic,
    title: "Décrivez",
    description:
      "Par la voix ou par texte, en français ou en langue locale. Trente secondes suffisent.",
    highlight: false,
  },
  {
    number: "02",
    icon: Filter,
    title: "Nous trions",
    description:
      "Notre moteur identifie le métier concerné : avocat, huissier, notaire ou juriste-conseil.",
    highlight: false,
  },
  {
    number: "03",
    icon: Handshake,
    title: "Mise en relation",
    description:
      "Le professionnel disponible le plus proche est notifié et vous répond directement.",
    highlight: true,
  },
  {
    number: "04",
    icon: Radar,
    title: "Suivez",
    description:
      "Statut en temps réel, messagerie intégrée, jusqu'à la résolution de votre situation.",
    highlight: false,
  },
];

export function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      className="relative overflow-hidden bg-paper py-24 md:py-32"
    >
      {/* pattern de fond — grille fine, écho discret du Hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 75%)",
          opacity: 0.035,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <AnimatedSection>
          <Highlighter
            action="underline"
            color="var(--color-signal)"
            strokeWidth={3}
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brass">
              Le parcours
            </p>{" "}
          </Highlighter>

          <h2 className="max-w-xl font-display text-3xl leading-tight text-ink md:text-5xl">
            De l'urgence à la solution, en quatre étapes.
          </h2>
        </AnimatedSection>

        <div className="relative mt-20">
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {steps.map((step, i) => (
              <StaggerItem key={step.number} className="relative">
                <div
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 md:p-7 ${
                    step.highlight
                      ? "border-signal/30 bg-signal/5 hover:border-signal/50 hover:bg-signal/8 hover:shadow-[0_24px_48px_-28px_var(--color-signal)]"
                      : "border-ink/10 bg-ink/2 hover:border-ink/20 hover:bg-ink/4 hover:shadow-[0_20px_40px_-28px_rgba(11,18,32,0.35)]"
                  }`}
                >
                  {/* numéro en filigrane */}
                  <span
                    className={`pointer-events-none absolute -right-2 -top-6 select-none font-display text-8xl transition-colors duration-500 ${
                      step.highlight
                        ? "text-signal/12 group-hover:text-signal/20"
                        : "text-ink/10 group-hover:text-ink/20"
                    }`}
                  >
                    {step.number}
                  </span>

                  <div className="relative">
                    {step.highlight && (
                      <span className="mb-4 inline-block rounded-full bg-signal px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-ink">
                        Le moment clé
                      </span>
                    )}

                    <div className="relative">
                      {step.highlight && (
                        <div className="absolute inset-0 animate-pulse rounded-2xl bg-signal/30 blur-lg" />
                      )}
                      <div
                        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${
                          step.highlight
                            ? "border-signal/40 bg-signal text-ink"
                            : "border-signal/20 bg-signal/10 text-signal"
                        }`}
                      >
                        <step.icon size={22} strokeWidth={1.75} />
                      </div>
                    </div>

                    <h3 className="mt-5 font-display text-xl text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* connecteur — uniquement dans l'espace entre deux cartes, jamais par-dessus */}
                {i < steps.length - 1 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 -right-6 z-10 hidden h-px w-6 -translate-y-1/2 md:block"
                  >
                    <motion.div
                      className="absolute inset-0 origin-left bg-linear-to-r from-signal/40 to-signal/40"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        duration: 0.5,
                        delay: 0.4 + i * 0.15,
                        ease: [0.21, 0.47, 0.32, 0.98],
                      }}
                    />
                    <motion.span
                      className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_8px_2px_var(--color-signal)]"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.3, delay: 0.75 + i * 0.15 }}
                    />
                  </div>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
