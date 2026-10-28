import { AuthShell } from "@/shared/components/AuthShell";
import { LoginVisualPanel } from "@/shared/components/LoginVisualPanel";
import { ReinitialiserMotDePasseForm } from "../components/ReinitialiserMotDePasseForm";

export function ReinitialiserMotDePassePage() {
  return (
    <AuthShell
      panel={<LoginVisualPanel />}
      tagline="Sécurisez votre compte"
      backTo="/login/professionnel"
      glow
    >
      <ReinitialiserMotDePasseForm />
    </AuthShell>
  );
}