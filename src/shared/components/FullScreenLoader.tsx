export function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper">
      <div className="size-8 animate-spin rounded-full border-2 border-ink/20 border-t-signal" />
    </div>
  );
}