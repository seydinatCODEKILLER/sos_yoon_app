export function EtatVide({
  icone,
  message,
  className = "py-10",
}: {
  icone: React.ReactNode;
  message: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-3 text-center ${className}`}
    >
      <span
        aria-hidden
        className="grid size-14 place-items-center rounded-full bg-ink/5 text-navy/60"
      >
        {icone}
      </span>
      <p className="text-sm text-ink/60">{message}</p>
    </div>
  );
}