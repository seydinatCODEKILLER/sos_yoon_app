interface PagePlaceholderProps {
  title: string;
}

export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center p-8">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-signal">
          En construction
        </p>
        <h1 className="mt-2 font-display text-2xl text-ink">{title}</h1>
      </div>
    </div>
  );
}
