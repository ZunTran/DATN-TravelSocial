"use client";

import {  Eye, MoreHorizontal, Tag} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar";
import { Button} from "@/components/ui/button";
import type { Post} from "../types/post.types";
// import { PostActions,} from "./post-actions";
import PostActions from "../../components/post-actions";
import { PostLocation,} from "../../components/post-location";
import { PostMedia,} from "../../components/post-media";
import { useEffect, useState } from "react";

interface PostCardProps {
  post: Post;
}

function formatDate(
  value: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function getInitials(
  username?: string | null,
) {
  if (!username) {
    return "US";
  }

  return username
    .slice(0, 2)
    .toUpperCase();
}

export function PostCard({
  post,
}: PostCardProps) {
  const [currentIsLiked, setCurrentIsLiked] =
    useState<boolean>(post.isPostLiked);
  const [currentLikeCount, setCurrentLikeCount] =
    useState<number>(post.likeCount);

  useEffect(() => {
    setCurrentIsLiked(post.isPostLiked);
    setCurrentLikeCount(post.likeCount);
  }, [post.isPostLiked, post.likeCount]);
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">

      <div className="flex items-start gap-3 p-4">
        <Avatar className="size-11 shrink-0">
          <AvatarImage
            src={
              post.authorAvatar ??
              undefined
            }
            alt={
              post.authorUsername ??
              "User"
            }
          />

          <AvatarFallback>
            {getInitials(
              post.authorUsername,
            )}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {/* <span className="truncate text-sm font-semibold">
              {post.authorUsername ??
                "Unknown user"}
            </span> 
            */}
            {post.authorUsername ? (
  <Link
    href={`/${encodeURIComponent(post.authorUsername)}`}
    className="truncate text-sm font-semibold hover:underline"
  >
    {post.authorUsername}
  </Link>
) : (
  <span className="truncate text-sm font-semibold">
    Unknown user
  </span>
)}

            {post.status ===
              "PUBLISHED" && (
              <span className="shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600">
                Published
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <span>
              {formatDate(
                post.createdAt,
              )}
            </span>

            <span>·</span>

            <span>
              {post.privacy}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </div>

      <div className="px-4 pb-4">
        {post.content && (
          <p className="whitespace-pre-wrap text-sm leading-6">
            {post.content}
          </p>
        )}

        {post.category && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Tag className="size-3.5" />

            <span>
              {post.category.name}
            </span>
          </div>
        )}

        <PostLocation location={post.location}  />
      </div>

      <PostMedia
        media={post.media ?? []}/>

<PostActions
  postId={post.id}
  likeCount={currentLikeCount}
  commentCount={post.commentCount}
  shareCount={post.shareCount}
  saveCount={post.saveCount}
  isLiked={currentIsLiked}
  isSaved={post.isPostSaved}
  onLikeChange={(
    nextIsLiked,
    nextLikeCount,
  ) => {
    setCurrentIsLiked(nextIsLiked);
    setCurrentLikeCount(nextLikeCount);
  }}
/>

      <div className="flex items-center gap-1 px-4 pb-3 text-[11px] text-muted-foreground">
        <Eye className="size-3" />

        <span>
          {post.viewCount} views
        </span>
      </div>
    </article>
  );
}

export default PostCard;
