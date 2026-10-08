import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AuthVisualPanel } from "./AuthVisualPanel";

interface AuthShellProps {
  panelTitle?: string;
  panelSubtitle?: string;
  /** Remplace le panneau radar par défaut */
  panel?: ReactNode;
  badge?: string;
  backTo?: string;
  backLabel?: string;
  children: ReactNode;
}

export function AuthShell({
  panelTitle,
  panelSubtitle,
  panel,
  badge = "Données chiffrées & confidentielles",
  backTo = "/login",
  backLabel = "Retour",
  children,
}: AuthShellProps) {
  return (
    <div className="grid min-h-dvh bg-paper md:grid-cols-2">
      <div className="hidden md:sticky md:top-0 md:block md:h-dvh">
        {panel ?? <AuthVisualPanel title={panelTitle} subtitle={panelSubtitle} />}
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
              <ShieldCheck className="size-3.5 text-signal" strokeWidth={1.75} />
              {badge}
            </span>
          </div>
          <Link
            to={backTo}
            className="group flex items-center gap-1.5 text-xs font-medium text-ink/70 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            {backLabel}
          </Link>
        </header>

        <main className="flex flex-1 items-center py-10">{children}</main>

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