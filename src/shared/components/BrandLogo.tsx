import { cn } from "@/shared/lib/utils";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/logo_blanc.png"
      alt="SOS Yoon"
      draggable={false}
      fetchPriority="high"
      className={cn("h-7 w-auto select-none", className)}
    />
  );
}