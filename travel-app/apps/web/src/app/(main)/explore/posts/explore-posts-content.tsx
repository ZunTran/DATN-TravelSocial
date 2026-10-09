'use client';

import { useSearchParams } from 'next/navigation';
import { useSearchPosts } from '@/features/explore/hooks/use-search-posts';
import { PostList } from '@/features/social/components/post-list';

export default function ExplorePostsContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword')?.trim() ?? '';

  const { posts, loading } = useSearchPosts(keyword, 1, 20);

  if (!keyword) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Posts</h1>

        <p className="text-muted-foreground">
          Enter a keyword to search posts.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Posts</h1>

      <PostList posts={posts} loading={loading} />
    </main>
  );
}