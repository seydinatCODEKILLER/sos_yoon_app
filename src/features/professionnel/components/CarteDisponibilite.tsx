import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useDisponibilite } from "../hooks/useDisponibilite";
import { useTableauDeBord } from "../hooks/useTableauDeBord";

export function CarteDisponibilite() {
  const { data } = useTableauDeBord("7j");
  const disponibilite = useDisponibilite();

  // Affichage optimiste de l'interrupteur pendant l'appel
  const disponible = disponibilite.isPending
    ? disponibilite.variables
    : data?.disponible;

  return (
    <div className="flex min-h-14 shrink-0 items-center gap-4 rounded-xl border border-ink/10 bg-white px-4 py-2 shadow-sm">
      <div>
        <Label htmlFor="disponibilite" className="text-sm font-semibold text-ink">
          Disponibilité immédiate
        </Label>
        <p className="text-xs text-ink/55">Recevoir les demandes</p>
      </div>
      <Switch
        id="disponibilite"
        checked={!!disponible}
        disabled={!data}
        onCheckedChange={(valeur) => disponibilite.mutate(valeur)}
        className="data-checked:bg-signal"
      />
    </div>
  );
}