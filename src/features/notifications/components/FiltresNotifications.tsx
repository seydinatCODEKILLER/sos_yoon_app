import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export type FiltreNotifications = "TOUTES" | "NON_LUES" | "LUES";

interface FiltresNotificationsProps {
  value: FiltreNotifications;
  onChange: (value: FiltreNotifications) => void;
  nonLues: number;
}

const ONGLETS: { id: FiltreNotifications; libelle: string }[] = [
  { id: "TOUTES", libelle: "Toutes" },
  { id: "NON_LUES", libelle: "Non lues" },
  { id: "LUES", libelle: "Lues" },
];

export function FiltresNotifications({
  value,
  onChange,
  nonLues,
}: FiltresNotificationsProps) {
  return (
    <div
      role="group"
      aria-label="Filtrer les notifications"
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
            {id === "NON_LUES" && (
              <Badge
                className={`h-5 min-w-5 justify-center rounded-full px-1.5 text-xs font-bold tabular-nums ${
                  actif
                    ? "bg-white/20 text-paper"
                    : nonLues > 0
                      ? "bg-signal text-paper"
                      : "bg-ink/8 text-ink/70"
                }`}
              >
                {nonLues}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}