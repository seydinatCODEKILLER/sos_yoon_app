import { cn } from "@/shared/lib/utils";

const LOGOS = {
  /** Pour les fonds sombres (sidebar bleu nuit) */
  blanc: "/images/logo_blanc.png",
  /** Pour les fonds clairs (sidebar de l'admin) */
  orange: "/images/logo_orange.png",
} as const;

export function BrandLogo({
  className = "",
  variant = "blanc",
}: {
  className?: string;
  variant?: keyof typeof LOGOS;
}) {
  return (
    <img
      src={LOGOS[variant]}
      alt="SOS Yoon"
      draggable={false}
      fetchPriority="high"
      className={cn("h-7 w-auto select-none", className)}
    />
  );
}