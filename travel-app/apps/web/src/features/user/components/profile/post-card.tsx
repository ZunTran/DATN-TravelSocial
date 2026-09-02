'use client';

import Image from 'next/image';

import {
  Bookmark,
  CalendarDays,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Tag,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

import { Card } from '@/components/ui/card';

import type { Post } from '../../../social/types/post.types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({
  post,
}: PostCardProps) {
  const authorName =
    post.authorUsername || 'User';

  const sortedMedia = [...post.media].sort(
    (a, b) =>
      a.displayOrder - b.displayOrder,
  );

  const formattedDate = new Date(
    post.createdAt,
  ).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="overflow-hidden rounded-2xl">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.authorAvatar ?? undefined}
              alt={authorName}
            />

            <AvatarFallback>
              {authorName
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {authorName}
            </p>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>@{authorName}</span>

              <span>·</span>

              <CalendarDays className="h-3 w-3" />

              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Post menu"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* CONTENT */}
      {post.content && (
        <div className="px-4 pb-4 sm:px-5">
          <p className="whitespace-pre-wrap text-sm leading-6">
            {post.content}
          </p>
        </div>
      )}

      {/* CATEGORY + LOCATION */}
      {(post.category || post.location) && (
        <div className="flex flex-wrap gap-2 px-4 pb-4 sm:px-5">
          {post.category && (
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1.5 text-xs">
              <Tag className="h-3.5 w-3.5" />

              <span className="font-medium">
                {post.category.name}
              </span>
            </div>
          )}

          {post.location && (
            <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate font-medium">
                {post.location.name}
              </span>

              {post.location.province && (
                <span className="text-muted-foreground">
                  · {post.location.province}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* MEDIA */}
      {sortedMedia.length > 0 && (
        <div
          className={
            sortedMedia.length === 1
              ? 'overflow-hidden'
              : 'grid gap-1 sm:grid-cols-2'
          }
        >
          {sortedMedia.map((media) => {
            if (media.mediaType === 'VIDEO') {
              return (
                <video
                  key={media.id}
                  src={media.mediaUrl}
                  controls
                  preload="metadata"
                  className="max-h-[600px] w-full bg-black object-contain"
                />
              );
            }

            return (
              <div
                key={media.id}
                className="relative aspect-square w-full overflow-hidden bg-muted sm:aspect-[4/3]"
              >
                <Image
                  src={media.mediaUrl}
                  alt="Post media"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* META */}
      <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground sm:px-5">
        <div className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          <span>{post.viewCount}</span>
          <span>views</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{post.likeCount} likes</span>
          <span>{post.commentCount} comments</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-4 border-t">
        <PostAction
          icon={<Heart className="h-4 w-4" />}
          label="Like"
          count={post.likeCount}
        />

        <PostAction
          icon={<MessageCircle className="h-4 w-4" />}
          label="Comment"
          count={post.commentCount}
        />

        <PostAction
          icon={<Share2 className="h-4 w-4" />}
          label="Share"
          count={post.shareCount}
        />

        <PostAction
          icon={<Bookmark className="h-4 w-4" />}
          label="Save"
          count={post.saveCount}
        />
      </div>
    </Card>
  );
}

interface PostActionProps {
  icon: React.ReactNode;
  label: string;
  count: number;
}

function PostAction({
  icon,
  label,
  count,
}: PostActionProps) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-1.5 px-2 py-3 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {icon}

      <span className="hidden sm:inline">
        {label}
      </span>

      <span>
        {count}
      </span>
    </button>
  );
}