import { AlertTriangle, Scale, Gavel, Stamp, BookOpen } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { NewDemandeForm } from "../components/NewDemandeForm";
import { DemandeInfoPanel } from "../components/DemandeInfoPanel";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const metiers = [
  { label: "Avocat", icon: Scale },
  { label: "Huissier", icon: Gavel },
  { label: "Notaire", icon: Stamp },
  { label: "Juriste-conseil", icon: BookOpen },
];

export function NewRequestPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="mx-auto max-w-4xl px-4 py-10 sm:py-14"
    >
      {/* En-tête de page */}
      <motion.div variants={item}>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-signal">
          Nouvelle demande
        </p>
        <h1 className="font-display mt-2 text-3xl text-ink">
          Décrivez votre situation
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Nous identifions automatiquement le professionnel du droit le plus
          adapté, disponible et proche de vous.
        </p>
      </motion.div>

      {/* Barre d'urgence vitale */}
      <motion.div
        variants={item}
        className="mt-6 flex items-center gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3"
      >
        <AlertTriangle size={16} className="shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800 sm:text-sm">
          Danger immédiat ? Cette plateforme ne remplace pas les secours.
          Contactez la <span className="font-medium">Police (17)</span> ou les{" "}
          <span className="font-medium">Sapeurs-pompiers (18)</span>.
        </p>
      </motion.div>

      {/* Panneau unifié : formulaire + info */}
      <motion.div
        variants={item}
        className="mt-6 grid divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white lg:grid-cols-[1fr_300px] lg:divide-x lg:divide-y-0"
      >
        <NewDemandeForm />
        <DemandeInfoPanel />
      </motion.div>

      {/* Bande de confiance : les 4 métiers */}
      <motion.div
        variants={item}
        className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        {metiers.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5"
          >
            <Icon size={13} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}