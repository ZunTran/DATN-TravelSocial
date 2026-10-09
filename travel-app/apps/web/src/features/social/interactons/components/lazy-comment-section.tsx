'use client';

import dynamic from 'next/dynamic';

const CommentSection = dynamic(
  () => import('./comment-section'),
  {
    ssr: false,

    loading: () => (
      <section className="rounded-2xl border bg-card p-5">
        <div className="mb-5">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted" />
        </div>

        <div className="mb-6 flex gap-3">
          <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />

            <div className="h-9 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex gap-3"
            >
              <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />

                <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },
);

export { CommentSection };