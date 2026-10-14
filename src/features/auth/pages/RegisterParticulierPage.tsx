import { Link } from "react-router-dom";
import { AuthShell, AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { RegisterParticulierForm } from "../components/RegisterParticulierForm";

export function RegisterParticulierPage() {
  return (
    <AuthShell
      panelTitle="Décrivez votre urgence, on s'occupe du reste."
      panelSubtitle="Votre compte particulier vous permet de déposer une demande et de suivre son traitement en temps réel auprès d'officiers et auxiliaires de justice agréés."
      backTo="/register"
    >
      <div className="text-left md:text-center">
        <AuthTitle>Créez votre compte</AuthTitle>
        <AuthSubtitle>
          Renseignez vos informations pour recevoir un code de validation par SMS.
        </AuthSubtitle>
      </div>

      <div className="mt-6 md:mt-8">
        <RegisterParticulierForm />
      </div>

      <p className="mt-6 text-center text-sm text-ink/60">
        Déjà un compte ?{" "}
        <Link to="/login" className="font-semibold text-signal hover:underline">Connectez-vous</Link>
      </p>
    </AuthShell>
  );
}