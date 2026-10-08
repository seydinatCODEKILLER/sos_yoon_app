import type { NavBadge } from "@/config/navigation";

interface NavBadgeViewProps {
  badge: NavBadge;
  value?: number;
  active?: boolean;
}

export function NavBadgeView({ badge, value, active }: NavBadgeViewProps) {
  switch (badge.kind) {
    case "label":
      return (
        <span className="rounded-md bg-(--nav-badge-bg) px-1.5 py-0.5 text-[10px] font-semibold text-(--nav-badge-fg)">
          {badge.text}
        </span>
      );

    case "count": {
      if (!value) return null;
      if (badge.tone === "muted") {
        return (
          <span className="text-xs tabular-nums text-(--nav-muted)">
            {value}
          </span>
        );
      }
      return (
        <span className="rounded-full bg-(--nav-badge-bg) px-2 py-0.5 text-[11px] font-semibold tabular-nums text-(--nav-badge-fg)">
          {value}
          {badge.suffix ? ` ${badge.suffix}` : ""}
        </span>
      );
    }

    case "dot": {
      // Point lié à une donnée : visible seulement s'il y a quelque chose
      if (badge.key && !value) return null;
      const color =
        badge.color === "success"
          ? "bg-emerald-500"
          : badge.color === "signal"
            ? active
              ? "bg-(color:--nav-active-fg)"
              : "bg-signal"
            : "bg-current opacity-50";
      return <span className={`block size-1.5 rounded-full ${color}`} />;
    }
  }
}