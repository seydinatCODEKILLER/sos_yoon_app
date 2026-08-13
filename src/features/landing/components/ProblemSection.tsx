import { motion } from "motion/react";
import { X, Check, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/shared/components/AnimatedSection";
import { StaggerGroup, StaggerItem } from "@/shared/components/StaggerGroup";

const transitions = [
  {
    before: "Recherche à l'aveugle dans un annuaire",
    after: "Orientation automatique vers le bon métier",
  },
  {
    before: "Aucune garantie de disponibilité",
    after: "Professionnel disponible confirmé",
  },
  {
    before: "Délai de réponse incertain",
    after: "Mise en relation en quelques minutes",
  },
];

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-32">
      {/* filtre de bruit, défini une fois */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id="problem-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0"
          />
        </filter>
      </svg>

      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection className="max-w-xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brass">
            Le constat
          </p>
          <h2 className="font-display text-3xl leading-tight text-ink md:text-5xl">
            Le temps de réaction fait la différence.
          </h2>
          <p className="mt-4 text-ink/60">
            Annuaires, recherches en ligne, recommandations informelles : les
            réflexes habituels ne garantissent ni rapidité ni pertinence en
            situation d'urgence.
          </p>
        </AnimatedSection>

        <div className="mt-14 hidden grid-cols-[1fr_3.5rem_1fr] items-center gap-0 md:grid">
          <p className="text-sm font-medium uppercase tracking-widest text-ink/35">
            Signal brouillé
          </p>
          <span />
          <p className="text-sm font-medium uppercase tracking-widest text-signal">
            Avec SOS Yoon
          </p>
        </div>

        <div className="relative mt-4 md:mt-3">
          {/* colonne vertébrale reliant les 3 transformations */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-3 bottom-3 hidden w-px -translate-x-1/2 md:block"
          >
            <div className="absolute inset-0 bg-ink/10" />
            <motion.div
              className="absolute inset-x-0 top-0 origin-top bg-linear-to-b from-brass via-signal to-brass"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            />
            <motion.div
              className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-signal shadow-[0_0_12px_2px_var(--color-signal)]"
              animate={{ top: ["0%", "100%"] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: 1.6,
              }}
            />
          </div>

          <StaggerGroup className="flex flex-col gap-5">
            {transitions.map((t, i) => (
              <StaggerItem key={i}>
                <div className="group grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_3.5rem_1fr] md:gap-0">
                  {/* avant — texture de parasites */}
                  <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-ink/2 px-6 py-5 transition-opacity duration-300 md:mr-6 group-hover:opacity-50">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.12]"
                      style={{ filter: "url(#problem-noise)" }}
                    />
                    <div className="relative flex items-center gap-3">
                      <X size={16} className="shrink-0 text-ink/30" />
                      <span className="text-sm leading-relaxed text-ink/45 line-through decoration-ink/20">
                        {t.before}
                      </span>
                    </div>
                  </div>

                  {/* nœud de transformation, posé sur la colonne vertébrale */}
                  <div className="relative z-10 flex items-center justify-center py-1 md:py-0">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.15 + i * 0.1,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      className="flex h-10 w-10 rotate-90 items-center justify-center rounded-full bg-signal text-ink ring-4 ring-paper md:rotate-0"
                    >
                      <ArrowRight size={16} strokeWidth={2.25} />
                    </motion.div>
                  </div>

                  {/* après — carte nette avec reflet */}
                  <div className="relative overflow-hidden rounded-3xl border border-signal/25 bg-ink px-6 py-5 text-paper transition-all duration-300 md:ml-6 group-hover:border-signal/50 group-hover:shadow-[0_20px_40px_-24px_var(--color-signal)]">
                    <motion.div
                      className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-paper/10 to-transparent"
                      animate={{ x: ["-120%", "320%"] }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        repeatDelay: 2.5,
                        ease: "easeInOut",
                        delay: i * 0.4,
                      }}
                    />
                    <div className="relative flex items-center gap-3">
                      <Check size={16} className="shrink-0 text-signal" />
                      <span className="text-sm leading-relaxed text-paper/85">
                        {t.after}
                      </span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
