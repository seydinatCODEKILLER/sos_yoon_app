/** Chargement de la liste : la forme des cartes à venir, plutôt qu'un spinner */
export function MesDemandesSquelette() {
  return (
    <div role="status" aria-label="Chargement de vos demandes" className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-ink/8 bg-white p-4"
        >
          <div className="flex gap-3">
            <span className="size-11 shrink-0 rounded-full bg-ink/6" />
            <div className="flex-1 space-y-2 pt-1">
              <span className="block h-3 w-20 rounded bg-ink/6" />
              <span className="block h-4 w-3/4 rounded bg-ink/8" />
              <span className="block h-3 w-1/2 rounded bg-ink/6" />
            </div>
          </div>
          <span className="mt-4 block h-10 rounded-xl bg-ink/5" />
          <span className="mt-3 block h-1 rounded-full bg-ink/8" />
        </div>
      ))}
    </div>
  );
}