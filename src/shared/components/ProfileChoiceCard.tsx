import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface ProfileChoiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  /** Petite étiquette à côté du titre (ex. « Dernier choix ») */
  tag?: string;
}

export function ProfileChoiceCard({ icon: Icon, title, description, to, tag }: ProfileChoiceCardProps) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-4 transition-all duration-200 hover:border-signal hover:bg-signal/5 hover:shadow-lg hover:shadow-signal/10 focus-visible:border-signal focus-visible:ring-3 focus-visible:ring-signal/20 focus-visible:outline-none"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal transition-transform duration-200 group-hover:scale-110">
        <Icon className="size-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-display text-lg font-semibold text-ink">{title}</span>
          {tag && (
            <span className="rounded-full bg-signal/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-signal uppercase">
              {tag}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-sm leading-relaxed text-navy/60">{description}</span>
      </span>

      <ArrowRight className="size-4 shrink-0 text-navy/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-signal" />
    </Link>
  );
}