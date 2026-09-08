"use client";

import {
  ProfilePage,
  ProfileSetup,
} from "@/features/user/components/profile";

import {
  useProfile,
} from "@/features/user/hooks/use-profile";



import {
  usePosts,
} from "@/features/social/hooks/use-posts";
import { useFollowList } from "@/features/user/hooks/use-follow-list";
import { useFollowCounts } from "@/features/user/hooks/use-follow-counts";
import { useInterests } from "@/features/user/hooks/use-interests";
import { useRouter } from "next/navigation";
import { FollowUser } from "@/features/user/types/follow";
import { useUpdateAvatar } from "@/features/user/hooks/use-update-avatar";

export default function ProfileRoute() {

  const router = useRouter();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    updateProfile,
    isAuthenticated,
    authLoading,
  } = useProfile();

  const {
  updateAvatar,
  loading: avatarLoading,
} = useUpdateAvatar();

  const {
  myInterests,
  loading: myInterestsLoading,
  error: myInterestsError,
} = useInterests();

const {
  posts,
  total: postTotal,
  loading: postsLoading,
  loadingMore: postsLoadingMore,
  hasMore,
  loadMore,
  prependPost,
  replacePost,
  removePost,
} = usePosts(
  1,
  3,
  profile
    ? {
        authorId: profile.id,
      }
    : undefined,
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
  // profile?.id,
} = useFollowList(profile?.id);


const {
  followerCount,
  followingCount,
} = useFollowCounts(profile?.id ?? '');

  const handleUserClick = (user: FollowUser) => {
  if (!profile) 
    return;

  const isCurrentUser = user.id === profile.id || user.username === profile.username;

  if (isCurrentUser) {
    router.push("/profile");
    return;
  }

  router.push(`/${user.username}`);
};


  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p>Please login to view your profile.</p>
      </div>
    );
  }


  if (profileLoading ) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="font-medium">
            Setting up your profile...
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }


  if (!profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="font-medium text-destructive">
            Profile was not created.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {profileError?.message ??
              "User Service did not create your profile."}
          </p>
        </div>
      </div>
    );
  }


  if (!profile.isCompleted) {
    return (
      <ProfileSetup
        profile={profile}
        onUpdate={async (input) => {
          return updateProfile(input);
        }}
      />
    );
  }


  const handleFollowersClick = () => {
  loadFollowersFirstPage();
};

const handleFollowingClick = () => {
  loadFollowingFirstPage();
};


  return (
    <div className="mx-auto max-w-5xl px-6">
      <ProfilePage
  profile={profile}

  isOwnProfile={true}
  isFollowing={false}
  onEditAvatar={updateAvatar}

  postCount={ postTotal ?? posts?.length ?? 0 }

  followerCount={followerCount}
  followingCount={followingCount}

  interests={myInterests ?? []}
  stories={[]}

  posts={posts ?? []}
  onPostCreated={prependPost}

  savedPosts={[]}

  postsLoading={
    postsLoading &&
    (posts?.length ?? 0) === 0
  }

  postsLoadingMore={ postsLoadingMore}
  hasMorePosts={ hasMore}
  onLoadMorePosts={loadMore}

  followers={followers}
  following={following}

  followersLoading={followersLoading}
  followingLoading={followingLoading}

  followersLoadingMore={followersLoadingMore}
  followingLoadingMore={followingLoadingMore}

  followersHasMore={followersHasMore}
  followingHasMore={followingHasMore}

  onFollowersClick={handleFollowersClick}
  onFollowingClick={handleFollowingClick}
  onLoadMoreFollowers={ loadMoreFollowers}
  onLoadMoreFollowing={loadMoreFollowing}

  onUserClick={ handleUserClick }
/>
    </div>
  );
}