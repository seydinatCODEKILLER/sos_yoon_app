import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Radio } from "lucide-react";
import { AnimatedSection } from "@/shared/components/AnimatedSection";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function FinalCta() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: brancher sur l'API ou un service tiers (Formspree) une fois disponible
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-32">
      {/* trame de points, différente de la grille du hero/footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--color-ink) 12%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at center, black 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-xl px-6">
        <AnimatedSection>
          <div className="mb-3 flex items-center justify-center gap-2">
            <Radio size={13} className="text-signal" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
              Canal de test — accès anticipé
            </span>
          </div>
        </AnimatedSection>

        {/* console : cadre avec coins de viseur */}
        <AnimatedSection delay={0.1} className="relative mt-6">
          {/* coins */}
          {[
            "top-0 left-0 border-t border-l",
            "top-0 right-0 border-t border-r",
            "bottom-0 left-0 border-b border-l",
            "bottom-0 right-0 border-b border-r",
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`absolute h-5 w-5 border-ink/20 ${pos}`}
            />
          ))}

          <div className="border border-ink/8 bg-ink/[0.015] px-6 py-12 text-center sm:px-12 md:py-16">
            <h2 className="font-display text-3xl leading-tight text-ink md:text-5xl">
              Aidez-nous à construire SOS Yoon.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ink/55">
              Laissez votre email pour tester la plateforme en avant-première et
              partager votre avis avant le lancement.
            </p>

            <div className="relative mx-auto mt-9 min-h-24 max-w-md">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col gap-3 sm:flex-row"
                  >
                    <div className="group relative flex-1">
                      <div className="absolute inset-0 rounded-md bg-signal/25 opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-100" />
                      <Input
                        type="email"
                        required
                        placeholder="votre@email.com"
                        className="relative h-12 border-ink/15 bg-paper text-ink placeholder:text-ink/35 focus-visible:border-signal/60 focus-visible:ring-signal/30"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 bg-signal text-ink transition-transform hover:-translate-y-0.5 hover:bg-signal/90"
                    >
                      Être testeur
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-3"
                  >
                    <div className="relative flex h-12 w-12 items-center justify-center">
                      {[0, 1].map((i) => (
                        <motion.span
                          key={i}
                          className="absolute h-full w-full rounded-full border border-signal"
                          initial={{ scale: 0.3, opacity: 0.8 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{
                            duration: 1,
                            delay: i * 0.15,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-ink"
                      >
                        <CheckCircle2 size={22} />
                      </motion.div>
                    </div>
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="font-mono text-xs uppercase tracking-widest text-ink/50"
                    >
                      Signal reçu — nous vous contacterons bientôt
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* statut, ancré sous le cadre comme un log technique */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-[11px] text-ink/35">
              places limitées — file d'attente ouverte
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
