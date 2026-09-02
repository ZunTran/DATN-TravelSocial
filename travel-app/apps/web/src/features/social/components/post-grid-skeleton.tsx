'use client';

export default function PostGridSkeleton() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-2xl border bg-card"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-5">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />

            <div className="space-y-2">
              <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2 px-5 pb-4">
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          </div>

          {/* Media */}
          <div className="aspect-[4/3] w-full animate-pulse bg-muted" />

          {/* Meta */}
          <div className="flex justify-between p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}