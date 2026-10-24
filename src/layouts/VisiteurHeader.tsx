import { Link, useLocation, useMatches } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface RouteHandle {
  title?: string;
}

export function VisiteurHeader() {
  const { pathname } = useLocation();
  const matches = useMatches();
  const accueil = pathname === "/";

  const titre = [...matches]
    .reverse()
    .map((m) => (m.handle as RouteHandle | undefined)?.title)
    .find(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 bg-paper/95 px-5 backdrop-blur md:px-10">
      <div className="flex min-w-0 items-center gap-1">
        {accueil ? (
          <Link to="/" aria-label="SOS Yoon, accueil" className="flex items-center">
            <img
              src="/images/logo_orange.png"
              alt="SOS Yoon"
              className="h-6 w-auto"
            />
          </Link>
        ) : (
          <>
            <Link
              to="/"
              aria-label="Retour à l'accueil"
              className="-ml-2 grid size-11 shrink-0 place-items-center rounded-full text-navy transition-colors hover:bg-ink/5"
            >
              <ArrowLeft className="size-6" aria-hidden />
            </Link>
            <h1 className="truncate text-[17px] font-bold text-navy">{titre}</h1>
          </>
        )}
      </div>

      {/* Sur mobile, le lien est dans la page, sous le bouton SOS */}
      <Link
        to="/login"
        className="hidden min-h-11 shrink-0 items-center px-1 text-[15px] font-semibold text-signal hover:underline md:inline-flex"
      >
        Se connecter
      </Link>
    </header>
  );
}