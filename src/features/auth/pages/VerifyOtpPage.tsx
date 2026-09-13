import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { AuthVisualPanel } from "@/shared/components/AuthVisualPanel";
import { CurvedDivider } from "@/shared/components/CurvedDivider";
import { OtpForm } from "../components/OtpForm";

type LocationState = { telephone?: string };

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { telephone } = (location.state as LocationState) ?? {};

  if (!telephone) {
    return <Navigate to="/register/particulier" replace />;
  }

  return (
    <div className="grid min-h-screen bg-paper md:grid-cols-2">
      <div className="relative hidden md:block">
        <AuthVisualPanel
          title="Plus qu'une étape avant de commencer."
          subtitle="Entrez le code reçu par SMS pour activer votre compte et déposer votre première demande."
        />
      </div>

      <CurvedDivider />

      <div className="relative flex flex-col overflow-x-hidden overflow-y-auto px-6 py-10 md:py-16">
        <motion.div
          className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 rounded-full bg-signal/10 blur-[100px]"
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="relative z-10 flex items-center gap-1.5 text-sm text-ink/50 transition-colors hover:text-ink/80"
        >
          <ArrowLeft size={14} />
          Retour
        </button>

        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full max-w-md"
          >
            <div className="text-center">
              <h1 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
                Vérifiez votre numéro
              </h1>
              <p className="mt-2 text-ink/60">
                Entrez le code à 6 chiffres envoyé au{" "}
                <span className="font-medium text-ink">{telephone}</span>
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <OtpForm telephone={telephone} onVerified={() => navigate("/app")} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}