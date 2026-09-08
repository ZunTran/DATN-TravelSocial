"use client";

import { Bookmark } from "lucide-react";

import { useSavedPosts } from "../hooks/use-saved-posts";
import { PostCard } from "./post-card";

export function SavedPostsPage() {
  const {
    posts,
    total,
    loading,
    error,
  } = useSavedPosts();

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Saved Posts
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Posts you saved for later.
            </p>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border bg-muted"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <h1 className="text-2xl font-bold">
            Saved Posts
          </h1>

          <p className="mt-4 text-sm text-destructive">
            Failed to load saved posts.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Bookmark className="size-5" />

            <h1 className="text-2xl font-bold">
              Saved Posts
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {total} saved {total === 1 ? "post" : "posts"}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-16 text-center">
            <Bookmark className="mx-auto mb-4 size-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              No saved posts
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Posts you save will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}