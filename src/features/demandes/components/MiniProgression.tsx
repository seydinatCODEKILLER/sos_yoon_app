import { Check } from "lucide-react";
import type { PhaseDemande } from "../types/demande.types";

const ETAPES: { id: PhaseDemande; libelle: string }[] = [
  { id: "ENVOYEE", libelle: "Envoyée" },
  { id: "PROS_NOTIFIES", libelle: "Pros notifiés" },
  { id: "ACCEPTEE", libelle: "Accepté" },
  { id: "CONTACT_ETABLI", libelle: "Contact" },
];

export function MiniProgression({ phase }: { phase: PhaseDemande }) {
  const courant = ETAPES.findIndex((e) => e.id === phase);

  return (
    <ol className="flex" aria-label="Progression de la demande">
      {ETAPES.map((etape, i) => {
        const faite = i <= courant;
        const last = i === ETAPES.length - 1;
        return (
          <li
            key={etape.id}
            aria-current={i === courant ? "step" : undefined}
            className="relative flex flex-1 flex-col items-center"
          >
            {/* Trait vers l'étape suivante */}
            {!last && (
              <span
                aria-hidden
                className={`absolute top-3 left-1/2 h-0.5 w-full ${
                  i + 1 <= courant ? "bg-emerald-600" : "bg-ink/10"
                }`}
              />
            )}
            {faite ? (
              <span className="relative z-10 grid size-6 place-items-center rounded-full bg-emerald-600 text-white">
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </span>
            ) : (
              <span className="relative z-10 grid size-6 place-items-center rounded-full bg-ink/8">
                <span className="size-2 rounded-full bg-ink/30" />
              </span>
            )}
            <span
              className={`mt-1.5 text-center text-[11px] leading-tight ${
                faite ? "font-medium text-ink" : "text-ink/40"
              }`}
            >
              {etape.libelle}
            </span>
          </li>
        );
      })}
    </ol>
  );
}