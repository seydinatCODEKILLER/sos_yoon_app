import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AuthShell, AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { LoginVisualPanel } from "@/shared/components/LoginVisualPanel";
import { memoriserProfil, type ProfilConnexion } from "../lib/dernierProfil";

interface LoginFormShellProps {
  profil: ProfilConnexion;
  title: string;
  subtitle: string;
  /** Route d'inscription correspondant à ce profil */
  registerTo: string;
  children: ReactNode;
}

export function LoginFormShell({ profil, title, subtitle, registerTo, children }: LoginFormShellProps) {
  // Arriver sur ce formulaire = dernier profil choisi
  useEffect(() => {
    memoriserProfil(profil);
  }, [profil]);

  return (
    <AuthShell
      panel={<LoginVisualPanel />}
      tagline="Connectez-vous à votre espace"
      backTo="/login"
      glow
    >
      <div className="text-center">
        <AuthTitle>{title}</AuthTitle>
        <AuthSubtitle>{subtitle}</AuthSubtitle>
      </div>

      <div className="mt-8">{children}</div>

      <div className="mt-6 space-y-2 text-center text-sm">
        <p className="text-ink/60">
          Pas encore de compte ?{" "}
          <Link to={registerTo} className="font-semibold text-signal hover:underline">
            Inscrivez-vous
          </Link>
        </p>
        <p>
          <Link to="/login" className="font-medium text-ink/60 hover:text-ink hover:underline">
            Changer de profil
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}