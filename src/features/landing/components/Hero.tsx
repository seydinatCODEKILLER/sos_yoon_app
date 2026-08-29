import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { Button } from "@/shared/components/ui/button";

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

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

// Ne pas charger la vidéo si : mouvement réduit demandé,
// data saver activé, ou connexion lente (2G/3G)
function computeShouldLoadVideo(): boolean {
  if (typeof window === "undefined") return true;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const connection = (navigator as NavigatorWithConnection).connection;
  const isSlowConnection =
    connection?.saveData === true ||
    ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");

  return !prefersReducedMotion && !isSlowConnection;
}

function useShouldLoadVideo() {
  const [shouldLoad] = useState(computeShouldLoadVideo);
  return shouldLoad;
}

export function Hero() {
  const shouldLoadVideo = useShouldLoadVideo();

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper min-h-[92vh] md:min-h-screen flex items-center">
      {/* vidéo de fond (ou poster seul si data limitée / reduced-motion) */}
      {shouldLoadVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster="/videos/justice-hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/justice-hero.webm" type="video/webm" />
          <source src="/videos/justice-hero-optimized.mp4" type="video/mp4" />
        </video>
      ) : (
        <img
          src="/videos/justice-hero-poster.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* overlays pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-ink/35" />
      <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/15 to-ink/30" />

      {/* grain léger */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative mx-auto w-full max-w-3xl px-6 py-24 text-center flex flex-col items-center"
      >
        <motion.div variants={item}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-signal">
            SOS Yoon
          </p>
          <div className="my-2 mx-auto h-px w-12 bg-linear-to-r from-brass to-transparent" />
          <p className="text-xs uppercase tracking-widest text-paper/50">
            Urgence juridique
          </p>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-3xl leading-tight text-balance md:text-5xl mt-4"
        >
          Le bon professionnel du droit, en quelques minutes.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-md text-base text-paper/80 text-balance md:text-lg"
        >
          Avocat, huissier, notaire ou juriste-conseil : décrivez votre
          situation, nous trouvons le professionnel disponible le plus proche —
          automatiquement.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button size="lg" className="bg-signal text-ink hover:bg-signal/90">
            Décrire mon urgence
          </Button>
          <a
            href="#comment-ca-marche"
            className="text-sm text-paper/70 underline underline-offset-4 hover:text-paper"
          >
            Comment ça marche
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
