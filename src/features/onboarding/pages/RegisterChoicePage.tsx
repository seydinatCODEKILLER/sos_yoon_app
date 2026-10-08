import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Scale, ShieldCheck, User } from "lucide-react";
import { AuthVisualPanel } from "@/shared/components/AuthVisualPanel";

const profiles = [
  {
    icon: User,
    title: "Particulier",
    description:
      "Vous cherchez un professionnel du droit pour une urgence personnelle ou familiale.",
    to: "/register/particulier",
  },
  {
    icon: Scale,
    title: "Professionnel du droit",
    description:
      "Avocat, huissier, notaire ou juriste-conseil souhaitant rejoindre la plateforme.",
    to: "/register/professionnel",
  },
] as const;

export function RegisterChoicePage() {
  return (
    <div className="grid min-h-dvh bg-paper md:grid-cols-2">
      <div className="hidden md:sticky md:top-0 md:block md:h-dvh">
        <AuthVisualPanel
          title="Rejoignez SOS Yoon, en quelques minutes."
          subtitle="Que vous soyez particulier ou professionnel du droit, créez votre compte et accédez à la plateforme."
        />
      </div>

      <div className="flex min-h-dvh flex-col px-6 py-6 md:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="font-display text-base text-ink md:hidden"
            >
              SOS Yoon
            </Link>
            <span className="hidden items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-medium text-navy/70 sm:flex">
              <ShieldCheck
                className="size-3.5 text-emerald-600"
                strokeWidth={1.75}
              />
              Données chiffrées &amp; confidentielles
            </span>
          </div>
          <Link
            to="/login"
            className="group flex items-center gap-1.5 text-xs font-medium text-ink/70 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Retour
          </Link>
        </header>

        <main className="flex flex-1 items-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mx-auto w-full max-w-md"
          >
            <h1 className="font-display text-3xl font-bold leading-tight text-ink">
              Quel type de compte souhaitez-vous créer ?
            </h1>
            <p className="mt-2 text-sm text-navy/50">
              Le formulaire d'inscription s'adapte selon votre profil.
            </p>

            <div className="mt-8 space-y-3">
              {profiles.map(({ icon: Icon, title, description, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-4 transition-all duration-200 hover:border-signal hover:bg-signal/5 hover:shadow-lg hover:shadow-signal/10 focus-visible:border-signal focus-visible:ring-3 focus-visible:ring-signal/20 focus-visible:outline-none"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal transition-transform duration-200 group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold text-ink">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-navy/60">
                      {description}
                    </span>
                  </span>

                  <ArrowRight className="size-4 shrink-0 text-navy/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-signal" />
                </Link>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-navy/50">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="font-semibold text-signal hover:underline"
              >
                Connectez-vous
              </Link>
            </p>
          </motion.div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/5 pt-4 text-xs text-navy/40">
          <span>© {new Date().getFullYear()} SOS YOON. Tous droits réservés.</span>
          {/* TODO : brancher les vraies routes */}
          <nav className="flex gap-4">
            <a href="#" className="hover:text-ink">Aide</a>
            <a href="#" className="hover:text-ink">Déontologie</a>
            <a href="#" className="hover:text-ink">Contact</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}