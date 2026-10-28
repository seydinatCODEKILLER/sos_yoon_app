import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Scale, User } from "lucide-react";
import { AuthShell, AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { LoginVisualPanel } from "@/shared/components/LoginVisualPanel";
import { ProfileChoiceCard } from "@/shared/components/ProfileChoiceCard";
import { lireDernierProfil, type ProfilConnexion } from "../lib/dernierProfil";

const PROFILS: {
  id: ProfilConnexion;
  icon: typeof User;
  title: string;
  description: string;
  to: string;
}[] = [
  {
    id: "particulier",
    icon: User,
    title: "Particulier",
    description: "Suivez vos demandes et échangez avec les professionnels du droit.",
    to: "/login/particulier",
  },
  {
    id: "professionnel",
    icon: Scale,
    title: "Professionnel du droit",
    description: "Avocat, huissier, notaire ou juriste-conseil : retrouvez vos demandes et vos dossiers.",
    to: "/login/professionnel",
  },
];

export function LoginPage() {
  // Lu une fois au chargement : le dernier profil utilisé passe en premier
  const [dernier] = useState(lireDernierProfil);
  const profils = dernier
    ? [...PROFILS].sort((a, b) => Number(b.id === dernier) - Number(a.id === dernier))
    : PROFILS;

  return (
    <AuthShell
      panel={<LoginVisualPanel />}
      tagline="Connectez-vous à votre espace"
      backTo="/"
      glow
    >
      <div className="text-center">
        <AuthTitle>Connexion</AuthTitle>
        <AuthSubtitle>Choisissez votre profil pour continuer.</AuthSubtitle>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mt-8 space-y-3"
      >
        {profils.map(({ id, icon, title, description, to }) => (
          <ProfileChoiceCard
            key={id}
            icon={icon}
            title={title}
            description={description}
            to={to}
            tag={id === dernier ? "Dernier choix" : undefined}
          />
        ))}
      </motion.div>

      <p className="mt-6 text-center text-sm text-ink/60">
        Pas encore de compte ?{" "}
        <Link to="/register" className="font-semibold text-signal hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </AuthShell>
  );
}