import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import { Mic, CheckCircle2, Scale } from "lucide-react";
import { AnimatedSection } from "@/shared/components/AnimatedSection";

const AUTO_ADVANCE_MS = 3200;

const screens = [
  { key: "record", label: "Décrire", accent: "signal" as const },
  { key: "triage", label: "Triage", accent: "brass" as const },
  { key: "connect", label: "Mise en relation", accent: "signal" as const },
];

function RecordScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-signal"
            initial={{ scale: 0.6, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeOut",
            }}
          />
        ))}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-signal/20">
          <Mic size={26} className="text-signal" />
        </div>
      </div>

      <div className="flex items-end gap-1">
        {[6, 14, 22, 12, 18, 8, 16].map((h, i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-signal/70"
            animate={{ height: [h, h * 1.8, h] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeInOut",
            }}
            style={{ height: h }}
          />
        ))}
      </div>

      <p className="text-center text-sm text-paper/70">
        Décrivez votre situation…
      </p>
    </div>
  );
}

function TriageScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <motion.div
          className="absolute h-full w-full rounded-full border-2 border-dashed border-brass/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.6,
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-signal text-ink"
        >
          <CheckCircle2 size={20} />
        </motion.div>
      </div>

      <p className="text-sm text-paper/60">Besoin identifié</p>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="inline-flex items-center gap-2 rounded-full border border-brass/30 bg-brass/10 px-4 py-1.5"
      >
        <Scale size={14} className="text-brass" />
        <span className="text-sm text-paper">Avocat</span>
      </motion.div>
    </div>
  );
}

function ConnectScreen() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowMessage(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <div className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-paper/5 px-4 py-3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/20 text-sm font-medium text-brass">
            MD
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-signal" />
        </div>
        <div className="text-left">
          <p className="text-sm text-paper">Me Diop</p>
          <p className="text-xs text-paper/50">Avocat · en ligne</p>
        </div>
      </div>

      <div className="min-h-11 self-start">
        <AnimatePresence mode="wait">
          {!showMessage ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl rounded-tl-sm bg-paper/10 px-4 py-3"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-paper/50"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="max-w-[85%] rounded-2xl rounded-tl-sm bg-paper/10 px-4 py-2.5 text-left text-sm text-paper/80"
            >
              Bonjour, je peux vous répondre dans
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-signal px-4 py-1.5 text-sm font-medium text-ink"
        >
          5 minutes
        </motion.div>
      )}
    </div>
  );
}

const content: Record<string, () => React.ReactNode> = {
  record: RecordScreen,
  triage: TriageScreen,
  connect: ConnectScreen,
};

export function AppShowcase() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 18 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 14);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % screens.length);
    }, AUTO_ADVANCE_MS);
  }

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function goTo(i: number) {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
    startTimer();
  }

  const ActiveScreen = content[screens[index].key];
  const accent = screens[index].accent;

  return (
    <section className="bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
        <AnimatedSection direction="left">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-signal">
            L'application
          </p>
          <h2 className="font-display text-3xl leading-tight md:text-5xl">
            Pensée pour être utilisée dans l'urgence.
          </h2>
          <p className="mt-4 max-w-md text-paper/70">
            Une interface volontairement simple : peu d'étapes, de gros boutons,
            un retour immédiat à chaque action.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {screens.map((screen, i) => (
              <button
                key={screen.key}
                onClick={() => goTo(i)}
                className="group flex flex-col gap-1.5 text-left"
              >
                <span className="flex items-center gap-3">
                  <span className="relative h-1 w-10 overflow-hidden rounded-full bg-paper/15">
                    {i === index && (
                      <motion.span
                        key={`${screen.key}-progress`}
                        className="absolute inset-y-0 left-0 origin-left rounded-full bg-signal"
                        style={{ width: "100%" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: AUTO_ADVANCE_MS / 1000,
                          ease: "linear",
                        }}
                      />
                    )}
                  </span>
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      i === index
                        ? "text-paper"
                        : "text-paper/40 group-hover:text-paper/60"
                    }`}
                  >
                    {screen.label}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection direction="right" className="mx-auto">
          <div
            className="relative"
            style={{ perspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* halo d'ambiance, bascule signal / brass selon l'écran */}
            <div className="absolute inset-0 -z-10">
              <motion.div
                className="absolute inset-0 rounded-full bg-signal/20 blur-3xl"
                animate={{ opacity: accent === "signal" ? 1 : 0 }}
                transition={{ duration: 0.7 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-brass/20 blur-3xl"
                animate={{ opacity: accent === "brass" ? 1 : 0 }}
                transition={{ duration: 0.7 }}
              />
            </div>

            <motion.div
              style={{ rotateX: springRotateX, rotateY: springRotateY }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-130 w-65 rounded-[2.5rem] border-8 border-paper/10 bg-black/60 p-2 shadow-2xl"
            >
              {/* boutons latéraux */}
              <span className="absolute -left-2.25 top-24 h-8 w-1 rounded-l-full bg-paper/10" />
              <span className="absolute -left-2.25 top-36 h-12 w-1 rounded-l-full bg-paper/10" />
              <span className="absolute -right-2.25 top-28 h-16 w-1 rounded-r-full bg-paper/10" />

              <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-ink">
                {/* reflet verre, statique */}
                <div
                  className="pointer-events-none absolute inset-0 z-30"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 35%)",
                  }}
                />

                {/* encoche */}
                <div className="absolute left-1/2 top-0 z-20 flex h-5 w-24 -translate-x-1/2 items-center justify-center gap-2 rounded-b-2xl bg-black">
                  <span className="h-1 w-1 rounded-full bg-paper/20" />
                  <span className="h-1 w-6 rounded-full bg-paper/10" />
                </div>

                {/* barre de statut */}
                <div className="relative z-10 flex items-center justify-between px-6 pt-3 text-[10px] font-medium text-paper/70">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      {[3, 5, 7].map((h) => (
                        <span
                          key={h}
                          className="w-0.5 rounded-full bg-signal"
                          style={{ height: h }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <div className="h-2.5 w-4 rounded-[3px] border border-paper/40 p-px">
                        <div className="h-full w-3/4 rounded-[1px] bg-paper/70" />
                      </div>
                      <div className="h-1 w-px rounded-r bg-paper/40" />
                    </div>
                  </div>
                </div>

                <div className="h-[calc(100%-2rem)] pt-4">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={screens[index].key}
                      custom={direction}
                      initial={{ opacity: 0, x: 40 * direction }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 * direction }}
                      transition={{
                        duration: 0.4,
                        ease: [0.21, 0.47, 0.32, 0.98],
                      }}
                      className="h-full"
                    >
                      <ActiveScreen />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* indicateur home */}
                <div className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-paper/20" />
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
