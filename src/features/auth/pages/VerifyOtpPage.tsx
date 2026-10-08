import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Smartphone } from "lucide-react";
import { AuthShell } from "@/shared/components/AuthShell";
import { OtpVisualPanel } from "@/shared/components/OtpVisualPanel";
import { OtpForm } from "../components/OtpForm";
import { formatInternationalPhone } from "../lib/phone";
import type { TokenResponse } from "../types/types";
import { getPostLoginRoute } from "@/shared/lib/getPostLoginRoute";

type LocationState = {
  telephone?: string; // format international : +221771234567
  type?: "INSCRIPTION" | "CONNEXION";
};

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { telephone, type = "CONNEXION" } =
    (location.state as LocationState | null) ?? {};

  if (!telephone) {
    return <Navigate to="/login" replace />;
  }

  const verifiedTelephone: string = telephone;

function handleVerified(response: TokenResponse) {
  navigate(getPostLoginRoute(response), { replace: true });
}

  return (
    <AuthShell
      panel={<OtpVisualPanel />}
      badge="Validation sécurisée par SMS"
      backTo={type === "INSCRIPTION" ? "/register/particulier" : "/login"}
      backLabel="Modifier le numéro"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mx-auto w-full max-w-sm text-center"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-navy/5 text-signal">
          <Smartphone className="size-5" />
        </span>

        <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-ink">
          Vérifiez votre numéro
        </h1>
        <p className="mt-2 text-sm text-navy/60">
          Entrez le code de vérification à 6 chiffres envoyé au{" "}
          <span className="block font-medium text-ink">
            {formatInternationalPhone(verifiedTelephone)}
          </span>
        </p>

        <div className="mt-8">
          <OtpForm
  telephone={verifiedTelephone}
  type={type}
  onVerified={handleVerified}
/>
        </div>
      </motion.div>
    </AuthShell>
  );
}
