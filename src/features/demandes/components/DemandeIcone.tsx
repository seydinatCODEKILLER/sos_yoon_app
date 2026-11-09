import { FileText, Mic } from "lucide-react";
import type { TypeSaisie } from "../types/demande.types";

interface DemandeIconeProps {
  typeSaisie: TypeSaisie;
  /** Demande urgente : l'icône passe en orange */
  urgent?: boolean;
}

/** Pastille de la demande : micro pour un message vocal, page pour un texte */
export function DemandeIcone({ typeSaisie, urgent = false }: DemandeIconeProps) {
  const Icone = typeSaisie === "VOCAL" ? Mic : FileText;
  return (
    <span
      aria-hidden
      className={`grid size-11 shrink-0 place-items-center rounded-full ${
        urgent ? "bg-signal/10 text-signal" : "bg-ink/5 text-navy"
      }`}
    >
      <Icone className="size-5" strokeWidth={1.75} />
    </span>
  );
}