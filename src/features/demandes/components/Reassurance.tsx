import { Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function Reassurance({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink/55",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="size-3.5 text-signal" aria-hidden />
        Avocats &amp; Huissiers assermentés
      </span>
      <span aria-hidden className="size-1 rounded-full bg-ink/25" />
      <span className="inline-flex items-center gap-1.5">
        <Lock className="size-3.5 text-signal" aria-hidden />
        100% Confidentiel
      </span>
    </p>
  );
}