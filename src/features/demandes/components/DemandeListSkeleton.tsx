import { Skeleton } from "@/shared/components/ui/skeleton";

interface DemandeListSkeletonProps {
  view: "liste" | "cartes";
}

export function DemandeListSkeleton({ view }: DemandeListSkeletonProps) {
  if (view === "cartes") {
    return (
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex h-40 flex-col rounded-2xl border border-border bg-white p-5"
          >
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}