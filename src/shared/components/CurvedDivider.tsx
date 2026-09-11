export function CurvedDivider() {
  return (
    <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-10 hidden w-44 -translate-x-1/2 overflow-visible md:block">
      <svg
        viewBox="0 0 200 1200"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="divider-blob" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="1" />
            <stop offset="50%" stopColor="var(--color-brass)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M70,0
             C120,150 20,280 80,420
             C140,560 10,680 70,820
             C120,940 20,1080 70,1200
             L130,1200
             C80,1080 180,940 130,820
             C40,680 200,560 140,420
             C80,280 180,150 130,0
             Z"
          fill="url(#divider-blob)"
        />
      </svg>
    </div>
  );
}