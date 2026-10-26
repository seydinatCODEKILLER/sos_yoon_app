import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export type FiltreDemandes = "EN_COURS" | "TERMINEES" | "TOUTES";

interface FiltresDemandesProps {
  value: FiltreDemandes;
  onChange: (value: FiltreDemandes) => void;
  /** Nombre de demandes en cours, affiché sur le premier onglet */
  enCours: number;
}

const ONGLETS: { id: FiltreDemandes; libelle: string }[] = [
  { id: "EN_COURS", libelle: "En cours" },
  { id: "TERMINEES", libelle: "Terminées" },
  { id: "TOUTES", libelle: "Toutes" },
];

export function FiltresDemandes({
  value,
  onChange,
  enCours,
}: FiltresDemandesProps) {
  return (
    <div
      role="group"
      aria-label="Filtrer les demandes"
      className="flex flex-wrap gap-2"
    >
      {ONGLETS.map(({ id, libelle }) => {
        const actif = value === id;
        return (
          <Button
            key={id}
            type="button"
            variant={actif ? "default" : "outline"}
            aria-pressed={actif}
            onClick={() => onChange(id)}
            className={`h-10 gap-2 rounded-full px-4 text-sm font-semibold shadow-sm ${
              actif
                ? "bg-navy text-paper hover:bg-navy/90"
                : "border-ink/8 bg-white text-ink/80 hover:bg-ink/3"
            }`}
          >
            {libelle}
            {id === "EN_COURS" && (
              <Badge
                className={`h-5 min-w-5 justify-center rounded-full px-1.5 text-xs font-medium tabular-nums ${
                  actif ? "bg-white/20 text-paper" : "bg-ink/8 text-ink/70"
                }`}
              >
                {enCours}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}