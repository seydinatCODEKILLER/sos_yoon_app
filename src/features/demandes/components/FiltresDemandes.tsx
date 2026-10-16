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
    <div role="group" aria-label="Filtrer les demandes" className="flex gap-2">
      {ONGLETS.map(({ id, libelle }) => {
        const actif = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={actif}
            onClick={() => onChange(id)}
            className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-sm transition-colors ${
              actif
                ? "bg-navy text-paper"
                : "border border-ink/8 bg-white text-ink/80 hover:bg-ink/3"
            }`}
          >
            {libelle}
            {id === "EN_COURS" && (
              <span
                className={`grid min-w-5 place-items-center rounded-full px-1.5 text-xs tabular-nums ${
                  actif ? "bg-white/20 text-paper" : "bg-ink/8 text-ink/70"
                }`}
              >
                {enCours}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}