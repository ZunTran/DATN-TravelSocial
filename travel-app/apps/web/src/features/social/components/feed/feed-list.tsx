"use client";

import type { Post} from "../../post/types/post.types";
import { PostCard} from "../../post/components/post-card";
import { FeedSkeleton,} from "./feed-skeleton";

interface FeedListProps {
  posts: Post[];
  loading?: boolean;
  error?: Error | undefined;
}

export function FeedList({ posts, loading = false, error}: FeedListProps) {
  if (loading && posts.length === 0) {
    return <FeedSkeleton />;
  }

  if (error && posts.length === 0) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <h2 className="font-semibold"> Unable to load your feed </h2>
        <p className="mt-1 text-sm text-muted-foreground"> {error.message} </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
          ✈️
        </div>

        <h2 className="font-semibold"> Your feed is empty </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Follow travelers and share your
          first adventure.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post}/>
      ))}

      {loading && (
        <FeedSkeleton />
      )}
    </div>
  );
}
