"use client";

import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { useSuggestedUsers } from "@/features/user/user-profile/hooks/use-suggested-users";
import { useFollow } from "@/features/user/user-interact/hooks/use-follow";

export function FriendRecommendation() {
  const {
    users,
    loading,
    error,
  } = useSuggestedUsers();

  return (
    <section className="rounded-2xl border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">
            People you may know
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Discover fellow travelers
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
        >
          See all
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && error && (
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
            <UserPlus className="size-4 text-muted-foreground" />
          </div>

         <p className="text-xs text-muted-foreground">You have no recommendation, set up your interest to see more</p>
        </div>
      )}

      {!loading &&
        !error &&
        users.length === 0 && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
              <UserPlus className="size-4 text-muted-foreground" />
            </div>

            <p className="text-xs text-muted-foreground">
              No recommendations yet.
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Add more interests to discover travelers
              with similar interests.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        users.length > 0 && (
          <div className="space-y-4">
            {users.map((user) => (
              <RecommendedUserItem
                key={user.id}
                user={user}
              />
            ))}
          </div>
        )}
    </section>
  );
}

function RecommendedUserItem({
  user,
}: {
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string | null;
    commonInterestsCount?: number | null;
  };
}) {
  const {
    isFollowing,
    toggleFollow,
    loading,
  } = useFollow(user.id);

  const initials =
    user.display_name?.slice(0, 2) ||
    user.username.slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/${user.username}`}
        className="shrink-0"
      >
        <Avatar className="size-10">
          <AvatarImage
            src={user.avatar_url ?? undefined}
            alt={user.username}
          />

          <AvatarFallback>
            {initials.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/${user.username}`}
          className="block truncate text-sm font-medium hover:underline"
        >
          {user.display_name || user.username}
        </Link>

        <p className="truncate text-xs text-muted-foreground">@{user.username}</p>

        {user.commonInterestsCount != null && (
          <p className="text-xs text-muted-foreground">
            {user.commonInterestsCount}{" "}
            {user.commonInterestsCount === 1
              ? "shared interest"
              : "shared interests"}
          </p>
        )}
      </div>

      <Button
        size="sm"
        variant={isFollowing ? "secondary" : "outline"}
        onClick={toggleFollow}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )}
      </Button>
    </div>
  );
}