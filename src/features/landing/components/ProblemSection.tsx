import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { Check, Radio } from "lucide-react";
import { AnimatedSection } from "@/shared/components/AnimatedSection";
import { StaggerGroup, StaggerItem } from "@/shared/components/StaggerGroup";
import { Highlighter } from "@/shared/components/ui/highlighter";

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

const noiseBars = [38, 62, 22, 78, 44, 68, 28, 52, 82, 34, 58, 20, 72, 46];
const signalBars = [68, 71, 69, 73, 70, 72, 70, 71, 73, 70];

// tracé "avant" chaotique → tracé "après" lisse, raccordés au point (260,30)
const wavePathBefore =
  "M0,30 L24,46 L48,12 L72,44 L96,14 L120,40 L144,18 L168,42 L192,16 L216,34 L240,24 L260,30";
const wavePathAfter =
  "M260,30 C285,8 310,52 335,30 C360,8 385,52 410,30 C435,8 460,52 480,30 L520,30";

export function ProblemSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.3"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper py-24 md:py-32"
    >
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

      <div className="absolute inset-x-0 top-0 h-px bg-ink/5">
        <motion.div
          className="h-full origin-left bg-signal"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection className="max-w-xl" direction="none">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/3 px-3 py-1">
            <Radio size={13} className="text-signal" />
            <span className="text-xs font-medium uppercase tracking-widest text-ink/50">
              Diagnostic
            </span>
          </div>
          <h2 className="font-display text-3xl leading-tight text-ink md:text-5xl">
            Le temps de réaction fait{" "}
            <Highlighter
              action="highlight"
              color="var(--color-signal)"
              strokeWidth={3}
            >
              la différence
            </Highlighter>
            .
          </h2>
          <p className="mt-4 text-ink/60">
            Annuaires, recherches en ligne, recommandations informelles : les
            réflexes habituels ne garantissent ni rapidité ni pertinence en
            situation d'urgence.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="mt-14 md:mt-16">
          <div className="relative flex h-24 items-end gap-1 overflow-hidden rounded border border-ink/8 bg-ink/2 px-5 pb-5 pt-8 md:h-28 md:gap-1.25 md:px-8">
            <span className="absolute left-5 top-3 text-[10px] font-medium uppercase tracking-widest text-ink/30 md:left-8">
              Signal brouillé
            </span>
            <span className="absolute right-5 top-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-signal md:right-8">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
              </span>
              Verrouillé
            </span>

            {noiseBars.map((h, i) => (
              <motion.div
                key={`n-${i}`}
                className="w-full rounded-t-sm bg-ink/15"
                animate={{ height: [`${h}%`, `${100 - h}%`, `${h}%`] }}
                transition={{
                  duration: 0.7 + (i % 5) * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.04,
                }}
              />
            ))}

            <div className="mx-1 hidden h-full w-px shrink-0 bg-linear-to-b from-transparent via-ink/15 to-transparent md:block" />

            {signalBars.map((h, i) => (
              <motion.div
                key={`s-${i}`}
                className="w-full rounded-t-sm bg-signal"
                style={{ boxShadow: "0 0 8px -1px var(--color-signal)" }}
                animate={{ height: [`${h}%`, `${h + 8}%`, `${h}%`] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>
        </AnimatedSection>

        {/* ── liste des transformations, repensée ── */}
        <div className="mt-6">
          <StaggerGroup className="flex flex-col gap-3">
            {transitions.map((t, i) => (
              <StaggerItem key={i}>
                <div className="group relative overflow-hidden rounded border border-ink/8 bg-ink/1.5 transition-colors duration-300 hover:border-signal/30 hover:bg-signal/3">
                  {/* pastille numéro qui se remplit au survol */}
                  <div className="grid grid-cols-[3.25rem_1fr] items-stretch md:grid-cols-[3.25rem_1fr_auto_1fr]">
                    <div className="row-span-2 flex items-center justify-center border-r border-ink/8 bg-ink/2 transition-colors duration-300 group-hover:border-signal/20 group-hover:bg-signal/10 md:row-span-1">
                      <span className="font-mono text-xs text-ink/30 transition-colors duration-300 group-hover:text-signal">
                        0{i + 1}
                      </span>
                    </div>

                    <div className="relative flex items-center overflow-hidden px-5 py-6 md:px-6">
                      <div
                        className="pointer-events-none absolute inset-0 opacity-[0.08]"
                        style={{ filter: "url(#problem-noise)" }}
                      />
                      <span className="relative text-sm leading-relaxed text-ink/40 line-through decoration-ink/25 md:text-[15px]">
                        {t.before}
                      </span>
                    </div>

                    {/* onde — pleine hauteur, élément central affirmé */}
                    <div className="hidden h-full w-40 items-center border-x border-ink/8 bg-ink/1.5 px-2 transition-colors duration-300 group-hover:border-signal/20 md:flex lg:w-52">
                      <svg
                        viewBox="0 0 520 60"
                        className="h-10 w-full"
                        preserveAspectRatio="none"
                      >
                        <path
                          d={wavePathBefore}
                          fill="none"
                          stroke="var(--color-ink)"
                          strokeOpacity="0.2"
                          strokeWidth="2"
                          strokeDasharray="2 5"
                          strokeLinecap="round"
                        />
                        <motion.path
                          d={wavePathAfter}
                          fill="none"
                          stroke="var(--color-signal)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          style={{
                            filter: "drop-shadow(0 0 4px var(--color-signal))",
                          }}
                          initial={{ pathLength: 0, opacity: 0 }}
                          whileInView={{ pathLength: 1, opacity: 1 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{
                            duration: 1,
                            delay: 0.2 + i * 0.15,
                            ease: [0.21, 0.47, 0.32, 0.98],
                          }}
                        />
                      </svg>
                    </div>

                    <div className="col-start-2 row-start-2 flex items-center gap-2.5 px-5 py-6 md:col-auto md:row-auto md:px-6">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/15 transition-colors duration-300 group-hover:bg-signal">
                        <Check
                          size={12}
                          strokeWidth={2.5}
                          className="text-signal transition-colors duration-300 group-hover:text-ink"
                        />
                      </span>
                      <span className="text-sm font-medium text-ink md:text-[15px]">
                        {t.after}
                      </span>
                    </div>
                  </div>

                  {/* onde version mobile, sous la ligne */}
                  <div className="flex items-center border-t border-ink/8 px-5 py-3 md:hidden">
                    <svg
                      viewBox="0 0 520 60"
                      className="h-6 w-full"
                      preserveAspectRatio="none"
                    >
                      <path
                        d={wavePathBefore}
                        fill="none"
                        stroke="var(--color-ink)"
                        strokeOpacity="0.2"
                        strokeWidth="2"
                        strokeDasharray="2 5"
                        strokeLinecap="round"
                      />
                      <motion.path
                        d={wavePathAfter}
                        fill="none"
                        stroke="var(--color-signal)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{
                          duration: 1,
                          delay: 0.1 + i * 0.1,
                          ease: [0.21, 0.47, 0.32, 0.98],
                        }}
                      />
                    </svg>
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
