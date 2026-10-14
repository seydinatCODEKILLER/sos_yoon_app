import { Link } from "react-router-dom";
import { AuthShell, AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { LoginVisualPanel } from "@/shared/components/LoginVisualPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { LoginParticulierForm } from "../components/LoginParticulierForm";
import { LoginProfessionnelForm } from "../components/LoginProfessionnelForm";

const TAB_TRIGGER_CLASS =
  "h-full rounded-full text-sm font-medium text-navy/50 transition data-active:bg-white data-active:text-ink data-active:shadow-sm";

export function LoginPage() {
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

      <Tabs defaultValue="particulier" className="mt-8">
        <TabsList className="grid h-10.5 w-full grid-cols-2 items-stretch overflow-hidden rounded-full bg-navy/5 p-1">
          <TabsTrigger value="particulier" className={TAB_TRIGGER_CLASS}>Particulier</TabsTrigger>
          <TabsTrigger value="professionnel" className={TAB_TRIGGER_CLASS}>Professionnel</TabsTrigger>
        </TabsList>
        <TabsContent value="particulier" className="mt-6"><LoginParticulierForm /></TabsContent>
        <TabsContent value="professionnel" className="mt-6"><LoginProfessionnelForm /></TabsContent>
      </Tabs>

      <p className="mt-6 text-center text-sm text-ink/60">
        Pas encore de compte ?{" "}
        <Link to="/register" className="font-semibold text-signal hover:underline">Inscrivez-vous</Link>
      </p>
    </AuthShell>
  );
}