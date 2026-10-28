import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { EnteteSuspension } from "../components/EnteteSuspension";
import { PanneauAbonnement } from "../components/PanneauAbonnement";

/** Chemin de la page affichée aux comptes suspendus (portée PAIEMENT), sans sidebar */
const ROUTE_SUSPENSION = "/pro/paiement";

export function AbonnementPage() {
  const { pathname } = useLocation();
  const suspendu = pathname === ROUTE_SUSPENSION;

  const contenu = (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-6"
    >
      <motion.header variants={apparition} className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Abonnement
        </h2>
        <p className="text-sm text-ink/60">
          {suspendu
            ? "Votre compte est suspendu. Réglez votre abonnement pour retrouver l'accès à votre espace."
            : "Votre plan, vos paiements et l'état de votre compte."}
        </p>
      </motion.header>
      <motion.div variants={apparition}>
        <PanneauAbonnement />
      </motion.div>
    </motion.div>
  );

  if (!suspendu) return contenu;

  return (
    <div className="min-h-dvh bg-paper">
      <EnteteSuspension />
      {contenu}
    </div>
  );
}
