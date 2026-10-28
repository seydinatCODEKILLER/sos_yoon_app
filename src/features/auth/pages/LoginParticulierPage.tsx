import { LoginFormShell } from "../components/LoginFormShell";
import { LoginParticulierForm } from "../components/LoginParticulierForm";

export function LoginParticulierPage() {
  return (
    <LoginFormShell
      profil="particulier"
      title="Connexion"
      subtitle="Espace particulier"
      registerTo="/register/particulier"
    >
      <LoginParticulierForm />
    </LoginFormShell>
  );
}