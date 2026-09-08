'use client';

import{ PostCard }from '../post/components/post-card';
import type { Post } from '../post/types/post.types';

interface PostGridProps {
  posts: Post[];
}

export default function PostGrid({posts}: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border bg-card px-6 py-16 text-center">
        <p className="text-sm font-medium"> No posts yet</p>
        <p className="mt-1 text-sm text-muted-foreground"> Your posts will appear here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
}