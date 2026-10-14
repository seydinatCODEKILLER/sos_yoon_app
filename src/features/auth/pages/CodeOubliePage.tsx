import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "@/shared/components/AuthShell";
import { StepProgress } from "../components/StepProgress";
import { CodeOublieTelephoneForm } from "../components/CodeOublieTelephoneForm";
import { CodeOublieOtpStep } from "../components/CodeOublieOtpStep";
import { NouveauCodeForm } from "../components/NouveauCodeForm";

const LABELS = ["Identification", "Code SMS", "Nouveau code"];

export function CodeOubliePage() {
  const navigate = useNavigate();
  const [etape, setEtape] = useState<1 | 2 | 3>(1);
  const [telephone, setTelephone] = useState("");
  const [jeton, setJeton] = useState("");

  return (
    <AuthShell
      panelTitle="Un code oublié, ça arrive."
      panelSubtitle="Réinitialisez votre code secret en quelques instants grâce à un SMS de vérification."
      tagline="Réinitialisation de votre code"
      backTo="/login"
      onBack={etape === 2 ? () => setEtape(1) : undefined}
    >
      <StepProgress step={etape} label={LABELS[etape - 1]} />

      <div className="mt-6">
        {etape === 1 && (
          <CodeOublieTelephoneForm
            onCodeSent={(tel) => {
              setTelephone(tel);
              setEtape(2);
            }}
          />
        )}

        {etape === 2 && (
          <CodeOublieOtpStep
            telephone={telephone}
            onEdit={() => setEtape(1)}
            onVerified={(j) => {
              setJeton(j);
              setEtape(3);
            }}
          />
        )}

        {etape === 3 && (
          <NouveauCodeForm
            jeton={jeton}
            onDone={() => navigate("/login", { replace: true })}
          />
        )}
      </div>
    </AuthShell>
  );
}