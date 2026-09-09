import { Skeleton } from "@/shared/components/ui/skeleton";

export function NotificationsSkeleton() {
  return (
    <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-5 py-4">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}