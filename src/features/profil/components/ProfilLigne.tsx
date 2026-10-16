import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ProfilLigneProps {
  to: string;
  icone: React.ReactNode;
  libelle: string;
  valeur?: string;
}

export function ProfilLigne({ to, icone, libelle, valeur }: ProfilLigneProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-ink/2"
    >
      <span aria-hidden className="shrink-0 text-navy">
        {icone}
      </span>
      <span className="flex-1 text-[15px] font-medium text-navy">{libelle}</span>
      {valeur && (
        <span className="max-w-40 truncate text-sm text-ink/60">{valeur}</span>
      )}
      <ChevronRight className="size-4 shrink-0 text-ink/30" aria-hidden />
    </Link>
  );
}