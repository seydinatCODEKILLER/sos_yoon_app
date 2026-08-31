import { Link } from "react-router-dom";
import { motion, type Variants } from "motion/react";
import { Compass } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getSpaceRoute } from "@/shared/lib/getSpaceRoute";

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

export function NotFoundPage() {
  const user = useAuthStore((s) => s.user);
  const homeRoute = user ? getSpaceRoute(user.role) : "/";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 text-paper">
      {/* Grille de points, écho visuel des autres écrans */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Halo lumineux animé */}
      <motion.div
        className="pointer-events-none absolute h-96 w-96 rounded-full bg-signal/10 blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative flex flex-col items-center text-center"
      >
        <motion.div variants={item} className="relative">
          <span className="font-display text-8xl leading-none text-paper/10 md:text-9xl">
            404
          </span>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-signal shadow-lg shadow-signal/20">
              <Compass className="h-8 w-8 text-ink" strokeWidth={1.5} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-signal">
            Page introuvable
          </p>
          <div className="my-2 mx-auto h-px w-10 bg-linear-to-r from-brass to-transparent" />
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-2xl text-paper md:text-3xl"
        >
          Cette page n'existe pas ou plus.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-3 max-w-sm text-sm text-paper/60"
        >
          Vérifiez l'adresse saisie, ou retournez à un endroit sûr — on vous y
          conduit en un clic.
        </motion.p>

        <motion.div variants={item} className="mt-8">
          <Button
            size="lg"
            className="bg-signal text-ink hover:bg-signal/90"
            render={<Link to={homeRoute} />}
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
