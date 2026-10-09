'use client';

import Link from 'next/link';

import {
  Loader2,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';



import type {
  ExploreUser,
} from '../types/explore.types';
import { useFollow } from '@/features/user/user-interact/hooks/use-follow';

interface ExploreUserItemProps {
  user: ExploreUser;
  onFollowed?: (userId: string) => void;
}

export function ExploreUserItem({
  user,
  onFollowed,
}: ExploreUserItemProps) {
  const {
    isFollowing,
    toggleFollow,
    loading,
  } = useFollow(user.id);

  const handleFollow = async () => {
    if (isFollowing) {
      await toggleFollow();
      return;
    }

    await toggleFollow();

    onFollowed?.(user.id);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <Link
        href={`/profile/${user.username}`}
        className="flex min-w-0 items-center gap-3"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user.avatar_url ?? undefined}
            alt={user.username}
          />

          <AvatarFallback>
            {user.username
              .slice(0, 1)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate font-medium">
            {user.display_name}
          </p>

          <p className="truncate text-sm text-muted-foreground">
            @{user.username}
          </p>

          {user.commonInterestsCount != null && (
            <p className="text-xs text-muted-foreground">
              {user.commonInterestsCount} common interests
            </p>
          )}
        </div>
      </Link>

      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={handleFollow}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isFollowing ? (
          'Following'
        ) : (
          'Follow'
        )}
      </Button>
    </div>
  );
}