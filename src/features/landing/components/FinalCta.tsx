import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
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
    <section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      {/* texture grille, écho du hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* glow ambiant */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/15 blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <AnimatedSection>
          <div className="mb-5 flex justify-center">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
            </span>
          </div>

          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-signal">
            Rejoindre les premiers testeurs
          </p>
          <h2 className="font-display text-3xl leading-tight md:text-5xl">
            Aidez-nous à construire SOS Yoon.
          </h2>
          <p className="mt-4 text-paper/70">
            Laissez votre email pour tester la plateforme en avant-première et
            partager votre avis avant le lancement.
          </p>
        </AnimatedSection>

        <div className="relative mt-10 min-h-24">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="group relative flex-1">
                  <div className="absolute inset-0 rounded-md bg-signal/20 opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-100" />
                  <Input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    className="relative h-12 border-paper/20 bg-paper/5 text-paper placeholder:text-paper/40 focus-visible:border-signal/60 focus-visible:ring-signal/30"
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
                  className="text-paper/80"
                >
                  Signal reçu — nous vous contacterons bientôt.
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
