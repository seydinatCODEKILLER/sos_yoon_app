import { AuthShell } from "@/shared/components/AuthShell";
import { LoginVisualPanel } from "@/shared/components/LoginVisualPanel";
import { MotDePasseOublieForm } from "../components/MotDePasseOublieForm";

export function MotDePasseOubliePage() {
  return (
    <AuthShell
      panel={<LoginVisualPanel />}
      tagline="Retrouvez l'accès à votre espace"
      backTo="/login/professionnel"
      glow
    >
      <MotDePasseOublieForm />
    </AuthShell>
  );
}