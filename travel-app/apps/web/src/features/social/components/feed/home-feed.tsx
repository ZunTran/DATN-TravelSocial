"use client";

import { Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {  useFeed} from "../../hooks/use-feed";
import { StoryCarousel} from "../stories/story-carousel";
import { CreatePostCard} from "../create-post/create-post-card";
import { FriendRecommendation} from "../friend-recommendation";
import {  FeedList} from "./feed-list";
import {  LoadMore} from "./load-more";

export function HomeFeed() {
  const {
    posts,
    hasNextPage,
    loading,
    loadingMore,
    error,
    loadMore,
  } = useFeed();

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight"> News Feed </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover adventures from people you follow.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search travelers, places, posts..."
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>


        <section className="mb-6">
          <StoryCarousel />
        </section>


        <div className="grid gap-6 lg:grid-cols-[minmax(0,680px)_300px] lg:items-start lg:justify-center">

          <div className="min-w-0 space-y-6">
            <CreatePostCard />

            <FeedList
              posts={posts}
              loading={loading}
              error={error}
            />

            <LoadMore
              hasNextPage={hasNextPage}
              loading={loadingMore}
              onLoadMore={loadMore}
            />
          </div>

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
