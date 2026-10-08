import { motion } from "motion/react";
import { AuthShell } from "@/shared/components/AuthShell";
import { RegisterParticulierForm } from "../components/RegisterParticulierForm";

export function RegisterParticulierPage() {
  return (
    <AuthShell
      panelTitle="Décrivez votre urgence, on s'occupe du reste."
      panelSubtitle="Votre compte particulier vous permet de déposer une demande et de suivre son traitement en temps réel auprès d'officiers et auxiliaires de justice agréés."
      backTo="/register"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mx-auto w-full max-w-sm"
      >
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold leading-tight text-ink">
            Créez votre compte
          </h1>
          <p className="mt-2 text-sm text-navy/50">
            Renseignez vos informations pour recevoir un code de validation par
            SMS.
          </p>
        </div>

        <div className="mt-8">
          <RegisterParticulierForm />
        </div>
      </motion.div>
    </AuthShell>
  );
}