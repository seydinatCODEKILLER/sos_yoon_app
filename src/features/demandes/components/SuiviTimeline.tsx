import { Check, Hourglass } from "lucide-react";

export type EtapeStatus = "done" | "current" | "pending";

export interface TimelineItem {
  id: string;
  titre: string;
  description?: string;
  status: EtapeStatus;
  /** Petite pastille à droite du titre (ex. « 6 huissiers ») */
  badge?: string;
  /** Couleur de la pastille : bleu par défaut, vert pour « CONFIRMÉ » */
  badgeTone?: "info" | "success";
  /** Description en vert (étape confirmée) */
  descriptionTone?: "success";
  /** Heure affichée à droite du titre (ex. « 14:32 ») */
  heure?: string;
}

function Marker({ status }: { status: EtapeStatus }) {
  if (status === "done") {
    return (
      <span className="relative z-10 flex size-7 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Check className="size-4" strokeWidth={3} aria-hidden />
      </span>
    );
  }
  if (status === "current") {
    return (
      <span className="relative z-10 flex size-7 items-center justify-center rounded-full bg-navy">
        <span className="size-2.5 rounded-full bg-signal" />
      </span>
    );
  }
  return (
    <span className="relative z-10 flex size-7 items-center justify-center rounded-full bg-ink/5 text-ink/30">
      <Hourglass className="size-3.5" aria-hidden />
    </span>
  );
}

export function SuiviTimeline({
  items,
  surlignerCourant = true,
}: {
  items: TimelineItem[];
  surlignerCourant?: boolean;
}) {
  return (
    <ol className="text-left">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const pending = item.status === "pending";
        return (
          <li
            key={item.id}
            aria-current={item.status === "current" ? "step" : undefined}
            className={`relative flex items-start gap-3 rounded-xl px-3 py-2 ${
              item.status === "current" && surlignerCourant ? "bg-ink/4" : ""
            }`}
          >
            {/* Trait vertical vers l'étape suivante */}
            {!last && (
              <span
                aria-hidden
                className={`absolute top-9 -bottom-4 left-6.25 w-px ${
                  item.status === "done" ? "bg-emerald-600" : "bg-ink/10"
                }`}
              />
            )}
            <Marker status={item.status} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-[15px] leading-snug font-semibold ${
                    pending ? "text-ink/40" : "text-ink"
                  }`}
                >
                  {item.titre}
                </p>
                {item.badge ? (
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                      item.badgeTone === "success"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  item.heure && (
                    <span
                      className={`shrink-0 text-xs tabular-nums ${
                        item.status === "current"
                          ? "font-semibold text-ink"
                          : "text-ink/50"
                      }`}
                    >
                      {item.heure}
                    </span>
                  )
                )}
              </div>
              {item.description && (
                <p
                  className={`text-[13px] leading-snug ${
                    pending
                      ? "text-ink/35"
                      : item.descriptionTone === "success"
                        ? "font-medium text-emerald-700"
                        : "text-ink/60"
                  }`}
                >
                  {item.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
