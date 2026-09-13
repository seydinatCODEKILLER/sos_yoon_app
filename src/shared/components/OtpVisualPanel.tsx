// @/shared/components/OtpVisualPanel.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MessageSquareText, ShieldCheck } from "lucide-react";

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
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRevealed((r) => (r + 1) % (DIGITS.length + 2));
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative hidden h-full w-full flex-col justify-between overflow-hidden bg-ink md:flex">
      {/* grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* blobs ambiants */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-brass/10 blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, 25, 0], y: [0, 15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-signal/10 blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, -20, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* badge sécurité */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-8 right-8 z-10 flex items-center gap-1.5 rounded-full border border-paper/15 bg-paper/5 px-3 py-1.5 backdrop-blur-sm"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-brass" strokeWidth={1.75} />
        <span className="text-[11px] font-medium text-paper/70">Vérification sécurisée</span>
      </motion.div>

      {/* en-tête */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 px-10 pt-12"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-signal">
          SOS Yoon
        </p>
        <h2 className="font-display mt-3 max-w-xs text-2xl leading-snug text-paper text-balance">
          {title}
        </h2>
      </motion.div>

      {/* scène : SMS avec code qui se matérialise */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-10">
        <div className="relative flex flex-col items-center">
          {/* particules flottantes */}
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

          {/* onde d'émission derrière l'icône message */}
          {!reduceMotion && (
            <>
              <motion.span
                className="absolute top-6 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border border-signal/40"
                animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute top-6 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border border-signal/40"
                animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1.3,
                }}
              />
            </>
          )}

          {/* icône message central */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-brass/40 bg-ink/80 backdrop-blur-sm">
            <div className="absolute inset-0 rounded-full bg-signal/10 blur-md" />
            <MessageSquareText
              className="relative h-7 w-7 text-brass"
              strokeWidth={1.5}
            />
          </div>

          {/* connecteur */}
          <div className="my-5 h-8 w-px bg-linear-to-b from-paper/20 to-transparent" />

          {/* chiffres du code, révélés un par un */}
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
        className="relative z-10 px-10 pb-12"
      >
        <p className="text-xs uppercase tracking-widest text-paper/40">
          Étape finale
        </p>
        <p className="mt-2 max-w-xs text-sm text-paper/60">{subtitle}</p>
      </motion.div>
    </div>
  );
}