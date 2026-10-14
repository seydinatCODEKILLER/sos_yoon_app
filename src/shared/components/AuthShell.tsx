import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Pencil, ShieldCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { AuthVisualPanel } from "./AuthVisualPanel";

const HERO_BG: React.CSSProperties = {
  backgroundColor: "#171630",
  backgroundImage: [
    "radial-gradient(90% 70% at 100% 0%, rgba(255,255,255,0.07) 0%, transparent 60%)",
    "radial-gradient(70% 60% at 0% 100%, rgba(249,97,13,0.10) 0%, transparent 65%)",
    "linear-gradient(180deg, #1c1b3d 0%, #171630 60%, #12112a 100%)",
  ].join(", "),
};

/** Titres partagés : même police et même taille sur mobile et sur web */
export function AuthTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "font-display text-3xl font-bold leading-tight text-ink",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function AuthSubtitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-2 text-sm text-navy/60", className)}>{children}</p>
  );
}

interface AuthShellProps {
  children: ReactNode;
  panelTitle?: string;
  panelSubtitle?: string;
  /** Remplace le panneau radar par défaut (desktop) */
  panel?: ReactNode;
  /** Desktop : badge par défaut « Données chiffrées & confidentielles ».
   *  Mobile : la pastille n'apparaît que si `badge` est fourni. */
  badge?: string;
  /** Destination du lien retour. `null` = pas de retour. */
  backTo?: string | null;
  backLabel?: string;
  /** Phrase sous le logo dans le bandeau mobile (défaut : panelTitle) */
  tagline?: string;
  /** Poignée de « sheet » en haut de la carte (mobile) */
  sheetHandle?: boolean;
  /** Largeur max du contenu (défaut : max-w-sm) */
  contentClassName?: string;
  /** Halo orange animé en arrière-plan (desktop) */
  glow?: boolean;

  /** Remplace le lien retour par un callback (ex. étape précédente d'un parcours) */
  onBack?: () => void;
}

export function AuthShell({
  panelTitle,
  panelSubtitle,
  panel,
  badge,
  backTo = "/login",
  backLabel,
  tagline,
  sheetHandle,
  contentClassName = "max-w-sm",
  glow,
  onBack,
  children,
}: AuthShellProps) {
  const mobileTopRow = !!(badge || backLabel);

  return (
    <div className="grid min-h-dvh bg-navy md:grid-cols-2 md:bg-paper">
      {/* Panneau visuel (desktop) : inchangé */}
      <div className="hidden md:sticky md:top-0 md:block md:h-dvh">
        {panel ?? (
          <AuthVisualPanel title={panelTitle} subtitle={panelSubtitle} />
        )}
      </div>

      <div className="flex min-h-dvh flex-col">
        {/* Haut bleu nuit (mobile uniquement) */}
        <div className="px-6 pb-16 pt-6 text-paper md:hidden" style={HERO_BG}>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Retour"
              className="-ml-2 inline-flex size-9 items-center justify-center rounded-full hover:bg-white/10"
            >
              <ArrowLeft className="size-5" />
            </button>
          ) : backTo ? (
            <Link
              to={backTo}
              aria-label="Retour"
              className="-ml-2 inline-flex size-9 items-center justify-center rounded-full hover:bg-white/10"
            >
              <ArrowLeft className="size-5" />
            </Link>
          ) : (
            <div className="h-9" />
          )}
          <p className="mt-10 font-display text-xl text-paper">SOS Yoon</p>
          {(tagline ?? panelTitle) && (
            <p className="mt-1 max-w-72 text-sm leading-snug text-paper/75">
              {tagline ?? panelTitle}
            </p>
          )}
        </div>

        {/* Bas blanc (mobile) / colonne de droite (desktop) */}
        <div className="relative -mt-8 flex flex-1 flex-col overflow-x-hidden rounded-t-4xl bg-paper px-6 pb-6 pt-6 md:mt-0 md:rounded-none md:px-12 md:py-6">
          {glow && (
            <motion.div
              className="pointer-events-none absolute right-0 top-1/3 hidden size-72 rounded-full bg-signal/10 blur-[100px] md:block"
              animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {sheetHandle && (
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/10 md:hidden" />
          )}

          {/* En-tête : version desktop d'origine, version mobile allégée */}
          <header
            className={cn(
              "relative z-10 items-center justify-between gap-3",
              mobileTopRow ? "mb-4 flex md:mb-0" : "hidden md:flex",
            )}
          >
            <span
              className={cn(
                "items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-medium text-navy/70",
                badge ? "inline-flex" : "hidden md:inline-flex",
              )}
            >
              <ShieldCheck
                className="size-3.5 text-signal"
                strokeWidth={1.75}
              />
              {badge ?? "Données chiffrées & confidentielles"}
            </span>

{(backTo || onBack) && (() => {
  const cls = cn(
    "group items-center gap-1.5 text-xs font-medium text-ink/70 transition-colors hover:text-ink",
    backLabel ? "inline-flex" : "hidden md:inline-flex",
  );
  const content = (
    <>
      <Pencil className="size-3.5 md:hidden" />
      <ArrowLeft className="hidden size-3.5 transition-transform group-hover:-translate-x-0.5 md:block" />
      {backLabel ?? "Retour"}
    </>
  );
  return onBack ? (
    <button type="button" onClick={onBack} className={cls}>{content}</button>
  ) : (
    <Link to={backTo!} className={cls}>{content}</Link>
  );
})()}
          </header>

          <main className="relative z-10 flex flex-1 items-start py-4 md:items-center md:py-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className={cn("mx-auto w-full", contentClassName)}
            >
              {children}
            </motion.div>
          </main>

          {/* Pied de page mobile */}
          <footer className="relative z-10 mt-2 border-t border-ink/10 pt-4 text-center md:hidden">
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-green-700">
              <Lock className="size-3.5" aria-hidden />
              Vos données sont chiffrées et protégées
            </p>
            <p className="mt-1 text-xs text-ink/40">
              © SOS YOON. Tous droits réservés.
            </p>
          </footer>

          {/* Pied de page desktop : inchangé */}
          <footer className="relative z-10 hidden flex-wrap items-center justify-between gap-2 border-t border-ink/5 pt-4 text-xs text-navy/40 md:flex">
            <span>
              © {new Date().getFullYear()} SOS YOON. Tous droits réservés.
            </span>
            {/* TODO : brancher les vraies routes */}
            <nav className="flex gap-4">
              <a href="#" className="hover:text-ink">
                Aide
              </a>
              <a href="#" className="hover:text-ink">
                Déontologie
              </a>
              <a href="#" className="hover:text-ink">
                Contact
              </a>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
}
