import { motion, type Variants } from "motion/react";
import { Construction, Sparkles } from "lucide-react";

interface PagePlaceholderProps {
  title: string;
  description?: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export function PagePlaceholder({
  title,
  description = "Cette section est en cours de développement et arrive bientôt.",
}: PagePlaceholderProps) {
  return (
    <div className="relative flex h-full min-h-[70vh] items-center justify-center overflow-hidden p-8">
      {/* Grille de points en fond, écho visuel du reste de l'app */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-ink) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Halo lumineux animé derrière l'illustration */}
      <motion.div
        className="pointer-events-none absolute h-72 w-72 rounded-full bg-signal/10 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative flex flex-col items-center text-center"
      >
        {/* Illustration : anneau pointillé rotatif + badge central */}
        <motion.div variants={item} className="relative mb-8 h-28 w-28">
          <motion.svg
            viewBox="0 0 112 112"
            className="absolute inset-0 h-full w-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="56"
              cy="56"
              r="52"
              fill="none"
              stroke="var(--color-brass)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              strokeLinecap="round"
              opacity="0.5"
            />
          </motion.svg>

          <motion.div
            className="absolute inset-3 flex items-center justify-center rounded-full bg-ink shadow-lg shadow-ink/10"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Construction className="h-9 w-9 text-signal" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-signal"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-ink" strokeWidth={2} />
          </motion.div>
        </motion.div>

        <motion.div variants={item}>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-signal">
            En construction
          </p>
          <div className="my-2 mx-auto h-px w-10 bg-linear-to-r from-brass to-transparent" />
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-2xl text-ink md:text-3xl"
        >
          {title}
        </motion.h1>

        <motion.p variants={item} className="mt-3 max-w-xs text-sm text-ink/60">
          {description}
        </motion.p>

        <motion.div variants={item} className="mt-6 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-signal"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
