interface ProfilSectionProps {
  titre: string;
  children: React.ReactNode;
}

export function ProfilSection({ titre, children }: ProfilSectionProps) {
  return (
    <section aria-label={titre}>
      <h3 className="mb-2 px-1 text-xs font-bold tracking-wider text-ink/50 uppercase">
        {titre}
      </h3>
      <div className="divide-y divide-ink/8 overflow-hidden rounded-xl border border-ink/8 bg-white">
        {children}
      </div>
    </section>
  );
}