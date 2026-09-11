import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { LoginVisualPanel } from "@/shared/components/LoginVisualPanel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { LoginParticulierForm } from "../components/LoginParticulierForm";
import { LoginProfessionnelForm } from "../components/LoginProfessionnelForm";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="relative grid min-h-screen bg-paper md:grid-cols-2">
      <div className="relative hidden md:block">
        <LoginVisualPanel
          title="Bon retour. Votre espace vous attend."
          subtitle="Reprennez là où vous vous êtes arrêté : vos demandes, vos échanges et vos documents, réunis au même endroit."
        />
      </div>

      <div className="relative flex flex-col overflow-x-hidden overflow-y-auto px-6 py-10 md:py-16">
        {/* fonds — quadrillage + points + blob */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-ink) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 rounded-full bg-signal/10 blur-[100px]"
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* header — logo (mobile) + retour (toujours visible) */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-display text-base text-ink">SOS Yoon</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Retour
          </button>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full max-w-md"
          >
            <div className="text-center">
              <h1 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
                Connexion
              </h1>
              <p className="mt-2 text-ink/60">
                Choisissez votre profil pour continuer.
              </p>
            </div>

            <Tabs defaultValue="particulier" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-ink/5 p-1">
                <TabsTrigger
                  value="particulier"
                  className="rounded-full text-sm data-[state=active]:bg-white data-[state=active]:text-ink data-[state=active]:shadow-sm"
                >
                  Particulier
                </TabsTrigger>
                <TabsTrigger
                  value="professionnel"
                  className="rounded-full text-sm data-[state=active]:bg-white data-[state=active]:text-ink data-[state=active]:shadow-sm"
                >
                  Professionnel
                </TabsTrigger>
              </TabsList>

              <TabsContent value="particulier" className="mt-6">
                <LoginParticulierForm />
              </TabsContent>

              <TabsContent value="professionnel" className="mt-6">
                <LoginProfessionnelForm />
              </TabsContent>
            </Tabs>

            <p className="mt-6 text-center text-sm text-ink/50">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="font-medium text-brass hover:underline"
              >
                Inscrivez-vous
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}