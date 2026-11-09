import type {
  CompteursDemandes,
  FiltreDemandes,
} from "../types/demande.types";

interface FiltresDemandesProps {
  value: FiltreDemandes;
  onChange: (value: FiltreDemandes) => void;
  /** Absents tant que le serveur n'a pas répondu : l'onglet s'affiche sans nombre */
  compteurs?: CompteursDemandes;
}

const ONGLETS: {
  id: FiltreDemandes;
  libelle: string;
  cle: keyof CompteursDemandes;
}[] = [
  { id: "TOUTES", libelle: "Toutes", cle: "toutes" },
  { id: "EN_COURS", libelle: "En cours", cle: "enCours" },
  { id: "TERMINEES", libelle: "Terminées", cle: "terminees" },
  { id: "ANNULEES", libelle: "Annulées", cle: "annulees" },
];

/** Onglets à soulignement ; défilent horizontalement sur petit écran */
export function FiltresDemandes({
  value,
  onChange,
  compteurs,
}: FiltresDemandesProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les demandes"
      className="-mx-5 flex gap-1 overflow-x-auto border-b border-ink/10 px-5 scrollbar-none md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {ONGLETS.map(({ id, libelle, cle }) => {
        const actif = value === id;
        const nombre = compteurs?.[cle];
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={actif}
            onClick={() => onChange(id)}
            className={`relative flex shrink-0 items-center gap-2 px-3 pb-3 text-sm outline-none transition-colors focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-signal/40 ${
              actif
                ? "font-semibold text-navy"
                : "font-medium text-ink/55 hover:text-ink"
            }`}
          >
            {libelle}
            {nombre !== undefined && (
              <span
                className={`min-w-5 rounded-full px-1.5 py-px text-center text-xs font-medium tabular-nums ${
                  actif && id === "EN_COURS" && nombre > 0
                    ? "bg-signal text-paper"
                    : "bg-ink/6 text-ink/60"
                }`}
              >
                {nombre}
              </span>
            )}
            {actif && (
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-signal"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}