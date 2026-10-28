import { AuthShell, AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { LoginVisualPanel } from "@/shared/components/LoginVisualPanel";
import { LoginAdminForm } from "../components/LoginAdminForm";

export function AdminLoginPage() {
  return (
    <AuthShell
      panel={<LoginVisualPanel />}
      tagline="Espace administration"
      backTo="/"
      glow
    >
      <div className="text-center">
        <AuthTitle>Administration</AuthTitle>
        <AuthSubtitle>Accès réservé aux administrateurs de SOS Yoon.</AuthSubtitle>
      </div>
      <div className="mt-8">
        <LoginAdminForm />
      </div>
    </AuthShell>
  );
}