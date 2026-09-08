"use client";

import { useRouter } from "next/navigation";

import { ProfilePage } from "@/features/user/components/profile";

import {
    PROFILE_STORAGE_KEY,
  useProfile,
  useProfileByUsername,
} from "@/features/user/hooks/use-profile";

import { usePosts } from "@/features/social/hooks/use-posts";
import { useFollowCounts } from "@/features/user/hooks/use-follow-counts";
import { useFollow } from "@/features/user/hooks/use-follow";
import { useFollowList } from "@/features/user/hooks/use-follow-list";
import { useUserInterests } from "../../hooks/use-interests";

import type { FollowUser } from "@/features/user/types/follow";

interface AnotherProfileRouteProps {
  username: string;
}

export default function AnotherProfileRoute({
  username,
}: AnotherProfileRouteProps) {
  const router = useRouter();


  const {
    profile: loggedInUser,
  } = useProfile();


  const {
    profile: viewedProfile,
    loading: profileLoading,
  } = useProfileByUsername(username);


  const {
    interests,
  } = useUserInterests(viewedProfile?.id);


  const {
    posts,
    total: postTotal,
    loading: postsLoading,
    loadingMore: postsLoadingMore,
    hasMore,
    loadMore,
  } = usePosts(
    1,
    3,
    viewedProfile
      ? {
          authorId: viewedProfile.id,
        }
      : undefined,
  );

  const {
    followerCount,
    followingCount,
  } = useFollowCounts(
    viewedProfile?.id ?? "",
  );


  const {
    followers,
    following,

    followersLoading,
    followingLoading,

    followersLoadingMore,
    followingLoadingMore,

    followersHasMore,
    followingHasMore,

    loadFollowersFirstPage,
    loadFollowingFirstPage,

    loadMoreFollowers,
    loadMoreFollowing,
  } = useFollowList(
    viewedProfile?.id,
  );



  const {
    isFollowing,
    toggleFollow,
    loading: followLoading,
  } = useFollow(
    viewedProfile?.id,
  );


  const handleUserClick = (user: FollowUser) => {
    if (!user) {
      return;
    }

    const storedProfile = localStorage.getItem( PROFILE_STORAGE_KEY);

  if (storedProfile) {
    try {
      const currentProfile = JSON.parse(storedProfile);

      if (user.username === currentProfile.username) {
        router.push("/profile");
        return;
      }
    } catch (error) {
      console.error(
        "Failed to parse current profile:",
        error,
      );
    }
  }
  router.push(`/${user.username}`);
  };

  const handleFollowersClick = () => {
    loadFollowersFirstPage();
  };


  const handleFollowingClick = () => {
    loadFollowingFirstPage();
  };


  if (profileLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        Loading profile...
      </div>
    );
  }


  if (!viewedProfile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        User not found.
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <ProfilePage
        profile={viewedProfile}
        isOwnProfile={false}

        isFollowing={isFollowing}
        onFollow={toggleFollow}
        followLoading={followLoading}

        postCount={
          postTotal ??
          posts?.length ??
          0
        }

        followerCount={followerCount}
        followingCount={followingCount}

        interests={interests}
        stories={[]}

        posts={posts ?? []}
        savedPosts={[]}

        postsLoading={
          postsLoading &&
          (posts?.length ?? 0) === 0
        }

        postsLoadingMore={
          postsLoadingMore
        }

        hasMorePosts={hasMore}
        onLoadMorePosts={loadMore}

        followers={followers}
        following={following}

        followersLoading={
          followersLoading
        }

        followingLoading={
          followingLoading
        }

        followersLoadingMore={
          followersLoadingMore
        }

        followingLoadingMore={
          followingLoadingMore
        }

        followersHasMore={
          followersHasMore
        }

        followingHasMore={
          followingHasMore
        }

        onFollowersClick={
          handleFollowersClick
        }

        onFollowingClick={
          handleFollowingClick
        }

        onLoadMoreFollowers={
          loadMoreFollowers
        }

        onLoadMoreFollowing={
          loadMoreFollowing
        }

        onUserClick={
          handleUserClick
        }
      />
    </div>
  );
}