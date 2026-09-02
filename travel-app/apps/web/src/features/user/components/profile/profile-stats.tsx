'use client';

import { Card } from '@/components/ui/card';

interface ProfileStatsProps {
  postCount: number;
  followerCount: number;
  followingCount: number;

  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

export default function ProfileStats({
  postCount,
  followerCount,
  followingCount,
  onFollowersClick,
  onFollowingClick,
}: ProfileStatsProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="grid grid-cols-3 divide-x">
        {/* POSTS */}
        <div className="flex flex-col items-center justify-center px-3 py-5">
          <span className="text-xl font-bold sm:text-2xl">
            {postCount}
          </span>

          <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Posts
          </span>
        </div>

        {/* FOLLOWERS */}
        <button
          type="button"
          onClick={onFollowersClick}
          className="flex flex-col items-center justify-center px-3 py-5 transition-colors hover:bg-muted/50"
        >
          <span className="text-xl font-bold sm:text-2xl">
            {followerCount}
          </span>

          <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Followers
          </span>
        </button>

        {/* FOLLOWING */}
        <button
          type="button"
          onClick={onFollowingClick}
          className="flex flex-col items-center justify-center px-3 py-5 transition-colors hover:bg-muted/50"
        >
          <span className="text-xl font-bold sm:text-2xl">
            {followingCount}
          </span>

          <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Following
          </span>
        </button>
      </div>
    </Card>
  );
}