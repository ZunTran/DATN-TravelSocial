"use client";

export function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({
        length: 2,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border bg-card"
        >
          {/* HEADER */}
          <div className="flex gap-3 p-4">
            <div className="size-11 animate-pulse rounded-full bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />

              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-2 px-4 pb-4">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />

            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />

            <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
          </div>

          {/* MEDIA */}
          <div className="aspect-video animate-pulse bg-muted" />

          {/* ACTIONS */}
          <div className="grid grid-cols-4 gap-2 p-3">
            {Array.from({
              length: 4,
            }).map((_, actionIndex) => (
              <div
                key={actionIndex}
                className="h-8 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
