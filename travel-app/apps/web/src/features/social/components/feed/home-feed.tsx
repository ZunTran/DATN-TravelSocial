"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFeed } from "../../hooks/use-feed";
import { StoryCarousel } from "../stories/story-carousel";
import { CreatePostCard } from "../../post/components/create-post-card";
import { FriendRecommendation } from "../friend-recommendation";
import { FeedList } from "./feed-list";
import { LoadMore } from "./load-more";
import { useRestoreFeedScroll } from "../../hooks/use-feed-scroll";

export function HomeFeed() {

  useRestoreFeedScroll();

  const {
    posts,
    hasNextPage,
    loading,
    loadingMore,
    error,
    loadMore,
    refetch,
  } = useFeed();

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">

        {/* TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            News Feed
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Discover adventures from people you follow.
          </p>
        </div>

        {/* STORIES */}
        <section className="mb-6">
          <StoryCarousel />
        </section>

        {/* FEED */}
        <div
          className="
            grid gap-6
            lg:grid-cols-[minmax(0,680px)_300px]
            lg:items-start
            lg:justify-center
          "
        >
          {/* MAIN COLUMN */}
          <div className="min-w-0 space-y-6">

            {/* CREATE POST */}
            <CreatePostCard
              onCreated={() => {
                refetch();
              }}
            />

            {/* POSTS */}
            <FeedList
              posts={posts}
              loading={loading}
              error={error}
            />

            {/* LOAD MORE */}
            <LoadMore
              hasNextPage={hasNextPage}
              loading={loadingMore}
              onLoadMore={loadMore}
            />
          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <FriendRecommendation />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}