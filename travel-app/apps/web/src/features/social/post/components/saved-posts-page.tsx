"use client";
import { Bookmark } from "lucide-react";
import { useProfile } from "@/features/user/user-profile/hooks/use-profile";
import { useSavedPosts } from "../hooks/use-saved-posts";
import { PostCard } from "./post-card";

export function SavedPostsPage() {
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  const profileId =
    !profileLoading && !profileError
      ? profile?.id
      : undefined;

  const {
    posts,
    total,
    loading: savedPostsLoading,
    error: savedPostsError,
  } = useSavedPosts(profileId);

  if (profileLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (profileError || !profile?.id) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
        <Bookmark className="h-10 w-10 text-muted-foreground" />

        <p className="text-sm text-muted-foreground">
          Không thể lấy thông tin profile.
        </p>
      </div>
    );
  }

  if (savedPostsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          <h1 className="text-lg font-semibold">
            Bài viết đã lưu
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }


  if (savedPostsError) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
        <Bookmark className="h-10 w-10 text-muted-foreground" />

        <p className="text-sm text-muted-foreground">
          Không thể tải bài viết đã lưu.
        </p>

        <p className="max-w-md text-xs text-muted-foreground">
          {savedPostsError.message}
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
        <Bookmark className="h-10 w-10 text-muted-foreground" />

        <h1 className="text-lg font-semibold">
          Chưa có bài viết đã lưu
        </h1>

        <p className="text-sm text-muted-foreground">
          Những bài viết bạn lưu sẽ xuất hiện ở đây.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bookmark className="h-5 w-5" />

        <h1 className="text-lg font-semibold">
          Bài viết đã lưu
        </h1>

        <span className="text-sm text-muted-foreground">
          ({total})
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}