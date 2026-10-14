import type { ComponentProps } from "react";
import { Smartphone } from "lucide-react";
import { cn } from "@/shared/lib/utils";

function SenegalFlag() {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 rounded-[3px]" aria-hidden>
      <rect width="8" height="16" fill="#00853f" />
      <rect x="8" width="8" height="16" fill="#fdef42" />
      <rect x="16" width="8" height="16" fill="#e31b23" />
      <polygon fill="#00853f" points="12,4.8 12.9,7.2 15.4,7.2 13.4,8.7 14.1,11.2 12,9.7 9.9,11.2 10.6,8.7 8.6,7.2 11.1,7.2" />
    </svg>
  );
}

export function PhoneField({
  invalid, className, ...props
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-13 items-center gap-3 rounded-xl border bg-white px-3.5 transition-colors focus-within:border-signal focus-within:ring-2 focus-within:ring-signal/20",
        invalid ? "border-red-400" : "border-ink/15",
      )}
    >
      <span className="flex items-center gap-2 border-r border-ink/10 pr-3 text-sm font-semibold text-ink">
        <SenegalFlag /> +221
      </span>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="77 123 45 67"
        aria-invalid={invalid}
        className={cn("min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/30", className)}
        {...props}
      />
      <Smartphone className="size-5 text-ink/40" aria-hidden />
    </div>
  );
}