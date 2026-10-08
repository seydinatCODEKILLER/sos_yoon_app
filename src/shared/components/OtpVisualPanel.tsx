import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MessageSquareText } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

const DIGITS = ["7", "4", "2", "9", "1", "5"];

const particles = [
  { left: "16%", top: "24%", delay: 0 },
  { left: "84%", top: "18%", delay: 0.5 },
  { left: "12%", top: "74%", delay: 1 },
  { left: "88%", top: "68%", delay: 0.3 },
  { left: "50%", top: "8%", delay: 1.5 },
];

interface OtpVisualPanelProps {
  title?: string;
  subtitle?: string;
}

export function OtpVisualPanel({
  title = "Plus qu'une étape avant de commencer.",
  subtitle = "Entrez le code reçu par SMS pour activer votre compte et déposer votre première demande.",
}: OtpVisualPanelProps) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(reduceMotion ? DIGITS.length : 0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setRevealed((r) => (r + 1) % (DIGITS.length + 2)),
      500,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-navy">
      {/* grille */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* lueurs */}
      <motion.div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-signal/20 blur-[110px]"
        animate={reduceMotion ? undefined : { x: [0, 25, 0], y: [0, 15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[110px]" />

      {/* logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-12 pt-12"
      >
        <BrandLogo />
      </motion.div>

      {/* titre */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 px-12 pt-16"
      >
        <h2 className="font-display max-w-sm text-4xl leading-[1.1] text-paper text-balance">
          {title}
        </h2>
      </motion.div>

      {/* scène : SMS avec code qui se matérialise */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-12">
        <div className="relative flex flex-col items-center">
          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-paper/30"
              style={{ left: p.left, top: p.top }}
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0.2, 0.8, 0.2], y: [0, -8, 0] }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* ondes d'émission */}
          {!reduceMotion &&
            [0, 1.3].map((delay) => (
              <motion.span
                key={delay}
                className="absolute top-0 left-1/2 size-24 -translate-x-1/2 rounded-full border border-signal/40"
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay,
                }}
              />
            ))}

          {/* icône message */}
          <div
            className="relative flex size-24 items-center justify-center rounded-full border-2 border-signal bg-navy/90 backdrop-blur-sm"
            style={{ boxShadow: "0 0 28px 2px rgba(249,97,13,0.3)" }}
          >
            <div className="absolute inset-0 rounded-full bg-signal/10 blur-md" />
            <MessageSquareText
              className="relative size-9 text-signal"
              strokeWidth={1.5}
            />
          </div>

          <div className="my-5 h-8 w-px bg-linear-to-b from-paper/20 to-transparent" />

          {/* chiffres du code */}
          <div className="flex items-center gap-2.5">
            {DIGITS.map((digit, i) => {
              const isRevealed = i < revealed;
              return (
                <div
                  key={i}
                  className={`flex h-11 w-9 items-center justify-center rounded-lg border font-display text-lg font-semibold transition-colors duration-300 ${
                    isRevealed
                      ? "border-signal/50 bg-signal/10 text-signal"
                      : "border-paper/15 bg-paper/5 text-transparent"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isRevealed && (
                      <motion.span
                        key={digit}
                        initial={{ opacity: 0, y: 6, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25 }}
                      >
                        {digit}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-[11px] uppercase tracking-widest text-paper/40">
            Code envoyé par SMS
          </p>
        </div>
      </div>

      {/* pied */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: [0.21, 0.47, 0.32, 0.98],
        }}
        className="relative z-10 px-12 pb-12"
      >
        <div className="max-w-md border-t border-paper/10 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-paper/60">
            Étape finale
          </p>
          <p className="mt-2 max-w-sm text-sm text-paper/60">{subtitle}</p>
        </div>
      </motion.div>
    </div>
  );
}