import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Smartphone } from "lucide-react";
import { AuthShell, AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { OtpVisualPanel } from "@/shared/components/OtpVisualPanel";
import { OtpForm } from "../components/OtpForm";
import { formatInternationalPhone } from "../lib/phone";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const { telephone } = (useLocation().state as { telephone?: string } | null) ?? {};

  if (!telephone) return <Navigate to="/register/particulier" replace />;

  return (
    <AuthShell
      panel={<OtpVisualPanel />}
      tagline="Plus qu'une étape avant de commencer."
      badge="Validation sécurisée"
      backTo="/register/particulier"
      backLabel="Modifier le numéro"
    >
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-signal/10 text-signal">
          <Smartphone className="size-6" aria-hidden />
        </span>
        <AuthTitle className="mt-5">Vérifiez votre numéro</AuthTitle>
        <AuthSubtitle>
          Entrez le code de vérification à 6 chiffres envoyé au
          <span className="mt-1 block font-semibold text-ink">
            {formatInternationalPhone(telephone)}
          </span>
        </AuthSubtitle>
      </div>

      <div className="mt-8">
<OtpForm
  telephone={telephone}
  type="INSCRIPTION"
  onVerified={(jetonInscription) => navigate("/inscription/code-secret", {
    replace: true,
    state: { telephone, jetonInscription },
  })}
/>
      </div>
    </AuthShell>
  );
}