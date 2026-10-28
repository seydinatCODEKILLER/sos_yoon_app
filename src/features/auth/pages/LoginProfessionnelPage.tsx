import { LoginFormShell } from "../components/LoginFormShell";
import { LoginProfessionnelForm } from "../components/LoginProfessionnelForm";

export function LoginProfessionnelPage() {
  return (
    <LoginFormShell
      profil="professionnel"
      title="Connexion"
      subtitle="Espace professionnel du droit"
      registerTo="/register/professionnel"
    >
      <LoginProfessionnelForm />
    </LoginFormShell>
  );
}