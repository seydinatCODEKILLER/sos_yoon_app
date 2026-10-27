import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { OngletSollicitations } from "../types/sollicitation.types";

const ONGLETS: { valeur: OngletSollicitations; libelle: string }[] = [
  { valeur: "NOUVELLES", libelle: "Nouvelles" },
  { valeur: "REFUSEES", libelle: "Refusées" },
  { valeur: "HISTORIQUE", libelle: "Historique" },
];

interface OngletsDemandesProps {
  valeur: OngletSollicitations;
  onChange: (valeur: OngletSollicitations) => void;
  compteNouvelles?: number;
}

export function OngletsDemandes({ valeur, onChange, compteNouvelles }: OngletsDemandesProps) {
  return (
    <div role="tablist" aria-label="Type de demandes" className="flex flex-wrap gap-1">
      {ONGLETS.map((o) => {
        const actif = o.valeur === valeur;
        return (
          <Button
            key={o.valeur}
            type="button"
            role="tab"
            aria-selected={actif}
            variant="ghost"
            onClick={() => onChange(o.valeur)}
            className={`h-9 gap-2 rounded-lg px-4 text-sm font-semibold ${
              actif
                ? "bg-navy text-white hover:bg-navy/90 hover:text-white"
                : "text-ink/65"
            }`}
          >
            {o.libelle}
            {o.valeur === "NOUVELLES" && !!compteNouvelles && (
              <Badge className="h-5 min-w-5 justify-center rounded-full border-0 bg-white/20 px-1.5 text-[11px] text-white">
                {compteNouvelles}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}