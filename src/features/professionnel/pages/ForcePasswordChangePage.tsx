import { motion, type Variants } from "motion/react";
import { KeyRound } from "lucide-react";
import { ChangePasswordForm } from "@/features/profil/components/ChangePasswordForm";

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

export function ForcePasswordChangePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-10 text-paper">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="w-full max-w-sm"
      >
        <motion.div variants={item} className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-signal/15">
            <KeyRound className="h-5 w-5 text-signal" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-signal">
            Première connexion
          </p>
          <h1 className="font-display mt-2 text-2xl text-paper">
            Choisissez votre mot de passe
          </h1>
          <p className="mt-2 text-sm text-paper/60">
            Pour sécuriser votre espace, définissez un nouveau mot de passe
            avant de continuer.
          </p>
        </motion.div>

        <motion.div variants={item}>
          {/* Formulaire réutilisé de la feature profil, développée pour l'utilisateur */}
          <ChangePasswordForm redirectTo="/pro" requireCurrentPassword={false} />
        </motion.div>
      </motion.div>
    </div>
  );
}
