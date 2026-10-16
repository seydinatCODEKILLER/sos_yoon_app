import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { profilRoutes } from "../lib/profilRoutes";

interface ProfilSousPageProps {
  titre: string;
  children: React.ReactNode;
}

export function ProfilSousPage({ titre, children }: ProfilSousPageProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full max-w-md flex-col px-5 pb-6 md:min-h-0 md:pt-10 md:pb-12">
      <header className="relative -mx-5 flex h-12 items-center justify-center border-b border-ink/8 px-5 md:mx-0 md:border-0 md:px-0">
        <Link
          to={profilRoutes.accueil}
          aria-label="Retour au profil"
          className="absolute left-3 grid size-10 place-items-center rounded-full text-navy transition-colors hover:bg-ink/5 md:left-0"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-base font-semibold text-navy">{titre}</h1>
      </header>

      <div className="mt-6 flex flex-1 flex-col">{children}</div>
    </div>
  );
}