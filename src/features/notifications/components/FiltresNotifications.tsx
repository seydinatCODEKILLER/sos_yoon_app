import type {
  CompteursNotifications,
  FiltreNotifications,
} from "../types/notification.types";

interface Props {
  value: FiltreNotifications;
  onChange: (value: FiltreNotifications) => void;
  compteurs: CompteursNotifications | undefined;
}

const ONGLETS: { id: FiltreNotifications; libelle: string }[] = [
  { id: "TOUTES", libelle: "Toutes" },
  { id: "NON_LUES", libelle: "Non lues" },
];

export function FiltresNotifications({ value, onChange, compteurs }: Props) {
  return (
    <div
      role="group"
      aria-label="Filtrer les notifications"
      className="inline-flex gap-1 rounded-full bg-ink/5 p-1"
    >
      {ONGLETS.map(({ id, libelle }) => {
        const actif = value === id;
        const nombre = id === "TOUTES" ? compteurs?.toutes : compteurs?.nonLues;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={actif}
            onClick={() => onChange(id)}
            className={`flex h-9 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-signal/50 ${
              actif ? "bg-white text-navy shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            {libelle}
            {nombre !== undefined && (
              <span
                className={`min-w-5 rounded-full px-1.5 text-center text-xs leading-5 font-bold tabular-nums ${
                  id === "NON_LUES" && nombre > 0
                    ? "bg-signal text-white"
                    : "bg-ink/8 text-ink/55"
                }`}
              >
                {nombre}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}