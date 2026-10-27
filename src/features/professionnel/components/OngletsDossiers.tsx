import { Button } from "@/shared/components/ui/button";
import type { CompteursDossiers, FiltreDossiers } from "../types/dossier.types";

const ONGLETS: { valeur: FiltreDossiers; libelle: string; cle: keyof CompteursDossiers }[] = [
  { valeur: "EN_COURS", libelle: "En cours", cle: "enCours" },
  { valeur: "EN_ATTENTE_CLIENT", libelle: "En attente client", cle: "enAttenteClient" },
  { valeur: "TOUS", libelle: "Tous", cle: "tous" },
  { valeur: "CLOTURES", libelle: "Clôturés", cle: "clotures" },
];

interface OngletsDossiersProps {
  valeur: FiltreDossiers;
  onChange: (valeur: FiltreDossiers) => void;
  compteurs?: CompteursDossiers;
}

export function OngletsDossiers({ valeur, onChange, compteurs }: OngletsDossiersProps) {
  return (
    <div
      role="tablist"
      aria-label="Statut des dossiers"
      className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-ink/5 p-1"
    >
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
            className={`h-8 shrink-0 gap-1.5 rounded-lg px-3 text-xs font-semibold ${
              actif ? "bg-white text-ink shadow-sm hover:bg-white" : "text-ink/60"
            }`}
          >
            {o.libelle}
            {compteurs && <span className="text-ink/45">({compteurs[o.cle]})</span>}
          </Button>
        );
      })}
    </div>
  );
}