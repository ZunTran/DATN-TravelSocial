'use client';

import { useSearchParams } from 'next/navigation';

import { ExploreUsers } from '@/features/explore/components/explore-users';
import { ExplorePosts } from '@/features/explore/components/explore-posts';

export default function ExploreContent() {
  const searchParams = useSearchParams();

  const keyword =
    searchParams.get('keyword')?.trim() ?? '';

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">
        Explore
      </h1>

      {!keyword ? (
        <p className="text-muted-foreground">
          Search for people or posts.
        </p>
      ) : (
        <div className="space-y-10">
          <ExploreUsers keyword={keyword} />

          <ExplorePosts keyword={keyword} />
        </div>
      )}
    </main>
  );
}