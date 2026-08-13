import { Scale, Clock, ShieldCheck } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/shared/components/StaggerGroup";

const stats = [
  {
    value: "4",
    label: "métiers du droit couverts",
    icon: Scale,
    live: false,
  },
  {
    value: "24/7",
    label: "orientation disponible",
    icon: Clock,
    live: true,
  },
  {
    value: "100%",
    label: "professionnels vérifiés",
    icon: ShieldCheck,
    live: false,
  },
];

export function TrustBanner() {
  return (
    <section className="border-t border-paper/10 bg-ink py-10 text-paper">
      <div className="mx-auto max-w-6xl px-6">
        <StaggerGroup className="grid grid-cols-1 divide-y divide-paper/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat, i) => (
            <StaggerItem
              key={stat.label}
              className={`flex items-center gap-4 py-6 sm:py-0 sm:px-8 ${
                i === 0 ? "sm:pl-0" : ""
              } ${i === stats.length - 1 ? "sm:pr-0" : ""}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brass/20 bg-brass/10">
                <stat.icon
                  size={17}
                  strokeWidth={1.75}
                  className="text-brass"
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl text-signal sm:text-3xl">
                    {stat.value}
                  </span>
                  {stat.live && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                    </span>
                  )}
                </div>
                <span className="text-sm text-paper/60">{stat.label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
