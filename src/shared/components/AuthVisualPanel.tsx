import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scale, Gavel, Stamp, BookOpen, type LucideIcon } from "lucide-react";

interface Metier {
  label: string;
  icon: LucideIcon;
  angle: number; // degrés, 0 = droite, -90 = haut
}

const metiers: Metier[] = [
  { label: "Avocat", icon: Scale, angle: -90 },
  { label: "Notaire", icon: Stamp, angle: 0 },
  { label: "Huissier", icon: Gavel, angle: 90 },
  { label: "Juriste-conseil", icon: BookOpen, angle: 180 },
];

const RADIUS = 34; // % du conteneur

function positionOf(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: 50 + RADIUS * Math.cos(rad),
    y: 50 + RADIUS * Math.sin(rad),
  };
}

const particles = [
  { left: "12%", top: "22%", delay: 0 },
  { left: "85%", top: "18%", delay: 0.6 },
  { left: "18%", top: "78%", delay: 1.1 },
  { left: "88%", top: "72%", delay: 0.3 },
  { left: "50%", top: "8%", delay: 1.6 },
];

interface AuthVisualPanelProps {
  title?: string;
  subtitle?: string;
}

export function AuthVisualPanel({
  title = "Le bon professionnel du droit, en quelques minutes.",
  subtitle = "Dès votre demande déposée, le dispatch identifie et sollicite le professionnel disponible le plus proche.",
}: AuthVisualPanelProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % metiers.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const target = positionOf(metiers[active].angle);

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

      {/* blobs ambiants animés */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brass/10 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-signal/10 blur-[100px]"
        animate={{ x: [0, -20, 0], y: [0, -25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

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

      {/* radar */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-10">
        <div className="relative aspect-square w-full max-w-90">
          {/* particules flottantes */}
          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-paper/30"
              style={{ left: p.left, top: p.top }}
              animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* anneaux d'orbite */}
          {["85%", "62%", "40%"].map((size) => (
            <div
              key={size}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/10"
              style={{ width: size, height: size }}
            />
          ))}

          {/* balayage radar */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
            style={{ width: "85%", height: "85%" }}
          >
            <motion.div
              className="absolute -inset-1/2"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(240,162,2,0.32) 22deg, transparent 70deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* ligne de connexion vers le professionnel trouvé */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <motion.line
              key={active}
              x1={50}
              y1={50}
              x2={target.x}
              y2={target.y}
              stroke="var(--color-signal)"
              strokeWidth={0.6}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </svg>

          {/* emblème central : balance de justice */}
          <div className="absolute top-1/2 left-1/2 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brass/40 bg-ink/80 backdrop-blur-sm">
            <div className="absolute inset-0 rounded-full bg-signal/10 blur-md" />
            <Scale
              className="relative h-1/3 w-1/3 text-brass"
              strokeWidth={1.5}
            />
          </div>

          {/* noeuds : les 4 métiers */}
          {metiers.map((metier, i) => {
            const pos = positionOf(metier.angle);
            const isActive = i === active;
            const Icon = metier.icon;
            return (
              <motion.div
                key={metier.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.12 : 1,
                    borderColor: isActive
                      ? "var(--color-signal)"
                      : "rgba(250,247,242,0.15)",
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border bg-ink/90 shadow-lg backdrop-blur-sm"
                >
                  {isActive && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/30" />
                  )}
                  <Icon
                    size={16}
                    className={isActive ? "text-signal" : "text-paper/50"}
                  />
                </motion.div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-signal/30 bg-ink/90 px-2.5 py-1 text-[10px] text-signal"
                    >
                      {metier.label} · disponible
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
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
          Avocat · Huissier · Notaire · Juriste-conseil
        </p>
        <p className="mt-2 max-w-xs text-sm text-paper/60">{subtitle}</p>
      </motion.div>
    </div>
  );
}
