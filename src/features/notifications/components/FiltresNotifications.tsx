export type FiltreNotifications = "TOUTES" | "NON_LUES" | "DEMANDES";

interface FiltresNotificationsProps {
  value: FiltreNotifications;
  onChange: (value: FiltreNotifications) => void;
  nonLues: number;
}

const ONGLETS: { id: FiltreNotifications; libelle: string }[] = [
  { id: "TOUTES", libelle: "Toutes" },
  { id: "NON_LUES", libelle: "Non lues" },
  { id: "DEMANDES", libelle: "Demandes" },
];

export function FiltresNotifications({
  value,
  onChange,
  nonLues,
}: FiltresNotificationsProps) {
  return (
    <div role="group" aria-label="Filtrer les notifications" className="flex gap-2">
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
            {id === "NON_LUES" && (
              <span
                className={`grid min-w-5 place-items-center rounded-full px-1.5 text-xs font-bold tabular-nums ${
                  actif
                    ? "bg-white/20 text-paper"
                    : nonLues > 0
                      ? "bg-signal text-paper"
                      : "bg-ink/8 text-ink/70"
                }`}
              >
                {nonLues}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}