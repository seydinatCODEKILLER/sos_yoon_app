import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  User,
  Scale,
  ArrowLeft,
  ArrowRight,
  Gavel,
  Stamp,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const profiles = [
  {
    icon: User,
    title: "Particulier",
    description: "Vous cherchez un professionnel du droit pour une urgence personnelle ou familiale.",
    to: "/register/particulier",
    accent: "signal",
  },
  {
    icon: Scale,
    title: "Professionnel du droit",
    description: "Avocat, huissier, notaire ou juriste-conseil souhaitant rejoindre la plateforme.",
    to: "/register/professionnel",
    accent: "brass",
  },
] as const;

const accentStyles = {
  signal: {
    iconBg: "bg-signal/10",
    iconText: "text-signal",
    border: "hover:border-signal/50",
    arrow: "text-signal",
    glow: "group-hover:shadow-[0_16px_40px_-16px_rgba(240,162,2,0.35)]",
  },
  brass: {
    iconBg: "bg-brass/10",
    iconText: "text-brass",
    border: "hover:border-brass/50",
    arrow: "text-brass",
    glow: "group-hover:shadow-[0_16px_40px_-16px_rgba(184,134,11,0.35)]",
  },
} as const;

/* Jeu réduit pour mobile : 3 icônes, repositionnées pour les écrans étroits */
const floatingIconsMobile = [
  { icon: Gavel, top: "9%", left: "7%", delay: 0, duration: 7 },
  { icon: BookOpen, top: "16%", left: "82%", delay: 0.6, duration: 6.5 },
  { icon: Scale, top: "76%", left: "79%", delay: 1.8, duration: 7.5 },
] as const;

const floatingIconsDesktop = [
  { icon: Gavel, top: "14%", left: "8%", delay: 0, duration: 7 },
  { icon: Stamp, top: "68%", left: "12%", delay: 1.2, duration: 8 },
  { icon: BookOpen, top: "20%", left: "90%", delay: 0.6, duration: 6.5 },
  { icon: Scale, top: "72%", left: "88%", delay: 1.8, duration: 7.5 },
] as const;

type FloatingIconProps = {
  icon: LucideIcon;
  top: string;
  left: string;
  delay: number;
  duration: number;
  className?: string;
};

function FloatingIcon({ icon: Icon, top, left, delay, duration, className = "" }: FloatingIconProps) {
  return (
    <motion.div
      className={`absolute items-center justify-center rounded-full border border-ink/10 bg-white/60 text-ink/25 shadow-sm backdrop-blur-sm ${className}`}
      style={{ top, left, width: "var(--bubble)", height: "var(--bubble)" }}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {/* L'icône fait toujours 50% de sa pastille, quelle que soit la taille */}
      <Icon className="h-1/2 w-1/2" strokeWidth={1.5} />
    </motion.div>
  );
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [--bubble:2.5rem] md:[--bubble:3.25rem]">
      {/* pattern de points — plus discret et plus dense sur mobile */}
      <div
        className="absolute inset-0 opacity-[0.07] bg-size-[18px_18px] md:opacity-[0.12] md:bg-size-[24px_24px]"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-ink) 1px, transparent 1px)",
        }}
      />

      {/* blobs ambiants — versions compactes sur mobile */}
      <motion.div
        className="absolute -left-16 -top-16 h-60 w-60 rounded-full bg-signal/10 blur-[70px] md:left-0 md:top-0 md:h-96 md:w-96 md:blur-[110px]"
        animate={{ x: [0, 24, 0], y: [0, 16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-brass/10 blur-[70px] md:bottom-0 md:right-0 md:h-80 md:w-80 md:blur-[100px]"
        animate={{ x: [0, -20, 0], y: [0, -12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* icônes flottantes — mobile */}
      {floatingIconsMobile.map(({ icon, top, left, delay, duration }, i) => (
        <FloatingIcon
          key={`m-${i}`}
          icon={icon}
          top={top}
          left={left}
          delay={delay}
          duration={duration}
          className="flex md:hidden"
        />
      ))}

      {/* icônes flottantes — desktop */}
      {floatingIconsDesktop.map(({ icon, top, left, delay, duration }, i) => (
        <FloatingIcon
          key={`d-${i}`}
          icon={icon}
          top={top}
          left={left}
          delay={delay}
          duration={duration}
          className="hidden md:flex"
        />
      ))}
    </div>
  );
}

export function RegisterChoicePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-paper px-6 py-8 md:px-12 md:py-12">
      <BackgroundDecor />

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group relative z-10 mb-8 flex items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Retour
      </button>

      <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-md flex-col justify-center md:max-w-2xl">
        <h1 className="text-center font-display text-2xl font-semibold leading-tight text-ink md:text-4xl">
          Quel type de compte souhaitez-vous créer ?
        </h1>
        <p className="mt-2 text-center text-ink/60 md:text-lg">
          Le formulaire d'inscription s'adapte selon votre profil.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {profiles.map(({ icon: Icon, title, description, to, accent }) => {
            const styles = accentStyles[accent];
            return (
              <button
                key={to}
                type="button"
                onClick={() => navigate(to)}
                className={`group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 md:gap-4 md:p-6 ${styles.border} ${styles.glow}`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconText} transition-transform duration-200 group-hover:scale-110 md:h-12 md:w-12`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <span className="flex-1">
                  <span className="block font-display text-lg font-semibold text-ink">
                    {title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink/60">
                    {description}
                  </span>
                </span>

                <span
                  className={`hidden items-center gap-1 text-sm font-medium ${styles.arrow} opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:flex`}
                >
                  Continuer
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}