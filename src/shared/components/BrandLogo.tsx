export function BrandLogo({ className = "" }: { className?: string }) {
  // TODO : remplacer par le logo SVG officiel
  return (
    <span
      className={`text-lg font-bold tracking-[0.18em] text-paper ${className}`}
    >
      SOSYOON
    </span>
  );
}