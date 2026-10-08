import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { LoginVisualPanel } from "@/shared/components/LoginVisualPanel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { LoginParticulierForm } from "../components/LoginParticulierForm";
import { LoginProfessionnelForm } from "../components/LoginProfessionnelForm";

const TAB_TRIGGER_CLASS =
  "h-full rounded-full text-sm font-medium text-navy/50 transition data-active:bg-white data-active:text-ink data-active:shadow-sm";

export function LoginPage() {

  return (
    <div className="grid min-h-dvh bg-paper md:grid-cols-2">
      <LoginVisualPanel />

      <div className="relative flex flex-col overflow-x-hidden px-6 py-8 md:px-14">
        <motion.div
          className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 rounded-full bg-signal/10 blur-[100px]"
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* header : logo (mobile) + retour */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-display text-base text-ink">SOS Yoon</span>
          </Link>

        </div>

        {/* formulaire centré verticalement */}
        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full max-w-88"
          >
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold leading-tight text-ink">
                Connexion
              </h1>
              <p className="mt-2 text-sm text-navy/50">
                Choisissez votre profil pour continuer.
              </p>
            </div>

            <Tabs defaultValue="particulier" className="mt-8">
              <TabsList className="grid h-10.5 w-full grid-cols-2 items-stretch overflow-hidden rounded-full bg-navy/5 p-1">
                <TabsTrigger value="particulier" className={TAB_TRIGGER_CLASS}>
                  Particulier
                </TabsTrigger>
                <TabsTrigger
                  value="professionnel"
                  className={TAB_TRIGGER_CLASS}
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

            <p className="mt-6 text-center text-sm text-navy/50">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="font-semibold text-signal hover:underline"
              >
                Inscrivez-vous
              </Link>
            </p>
          </motion.div>
        </div>

        <p className="relative z-10 text-center text-xs text-navy/40">
          © SOS YOON. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}