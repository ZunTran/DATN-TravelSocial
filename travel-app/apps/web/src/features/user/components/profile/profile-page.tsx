'use client';

import { 
  useEffect,
  useState } from 'react';

import ProfileHeader from './profile-header';
import ProfileStats from './profile-stats';
import { ProfileInterests } from './profile-interests';
import ProfileTabs from './profile-tabs';
import ProfileStories from './profile-stories';
import ProfileFollowDialog from './profile-follow-dialog';

import type { UserProfile } from '../../types/profile';
import type { InterestTag } from '../../types/interest';
import type { Post } from '@/features/social/post/types/post.types';
import type { FollowUser } from '../../types/follow';
import { CreatePostCard } from '@/features/social/components';

interface Story {
  id: string;
  mediaUrl: string;
  mediaType?: string | null;
  expiresAt: string;
}


interface ProfilePageProps {
  profile: UserProfile;

  isOwnProfile: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;

  postCount: number;
  followerCount: number;
  followingCount: number;

  followLoading?: boolean;
  onUnfollow?: () => void;

  interests: InterestTag[];
  stories: Story[];

  posts: Post[];
  savedPosts?: Post[];
  onPostCreated?: (post: Post) => void;

  postsLoading?: boolean;
  postsLoadingMore?: boolean;
  hasMorePosts?: boolean;
  onLoadMorePosts?: () => void;

  followers?: FollowUser[];
  following?: FollowUser[];
  followersLoading?: boolean;
  followingLoading?: boolean;

  onFollowersClick?: () => void;
  onFollowingClick?: () => void;

  onEditProfile?: () => void;
  onEditAvatar?: (file: File) => Promise<UserProfile>;
  onEditCover?: () => void;

  followersLoadingMore?: boolean;
  followingLoadingMore?: boolean;
  followersHasMore?: boolean;
  followingHasMore?: boolean;
  onLoadMoreFollowers?: () => void;
  onLoadMoreFollowing?: () => void;

  onUserClick?: (user: FollowUser) => void;

}

export function ProfilePage({
  profile: initialProfile,

  isOwnProfile,
  isFollowing = false,

  onFollow,
  followLoading = false,
  onUnfollow,

  postCount,
  followerCount,
  followingCount,

  interests,
  stories,

  posts,
  savedPosts = [],
  onPostCreated,

  postsLoading = false,
  postsLoadingMore = false,
  hasMorePosts = false,
  onLoadMorePosts,


  followers = [],
  following = [],

  followersLoading = false,
  followingLoading = false,

  onFollowersClick,
  onFollowingClick,

  onEditProfile,
  onEditAvatar,
  onEditCover,

  followersLoadingMore = false,
  followingLoadingMore = false,
  followersHasMore = false,
  followingHasMore = false,

  onLoadMoreFollowers,
  onLoadMoreFollowing,
  onUserClick,
  
}: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  
  useEffect(() => {
  setProfile(initialProfile);
}, [initialProfile]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [followDialog, setFollowDialog] = useState< 'followers' | 'following' | null >(null);

  const handleEditProfile = () => {
    setUpdateSuccess(false);
    setIsEditingProfile(true);
    onEditProfile?.();
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };


  const handleProfileUpdated = ( updatedProfile: UserProfile ) => {
    setProfile(updatedProfile);
    setIsEditingProfile(false);
    setUpdateSuccess(true);

    window.setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);
  };

  const handleFollowersClick = () => {
    setFollowDialog('followers');
    onFollowersClick?.();
  };

  const handleFollowingClick = () => {
    setFollowDialog('following');

    onFollowingClick?.();
  };

  return (
    <>
      <div className="space-y-6">

        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
          followLoading={followLoading}
          onEditAvatar={onEditAvatar}
          onEditCover={onEditCover}
        />

{isOwnProfile && (
  <CreatePostCard
    onCreated={(post) => {
      onPostCreated?.(post);
    }}
  />
)}


        <ProfileStats
          postCount={postCount}
          followerCount={followerCount}
          followingCount={followingCount}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
        />

        <ProfileInterests
          interests={interests}
          isOwnProfile={isOwnProfile}

        />


        <ProfileStories
          stories={stories}
        />


        <ProfileTabs
          isOwnProfile={isOwnProfile}
          profile={profile}
          posts={posts}
          savedPosts={savedPosts}

          onPostCreated={onPostCreated}

          postsLoading={postsLoading}
  postsLoadingMore={postsLoadingMore}
  hasMorePosts={hasMorePosts}
  onLoadMorePosts={onLoadMorePosts}
  
          isEditingProfile={isEditingProfile}
          onEditProfile={handleEditProfile}
          onCancelEdit={handleCancelEdit}
          onProfileUpdated={handleProfileUpdated}
        />


        {updateSuccess && (
          <div
            className="
              fixed
              right-6
              top-6
              z-50
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-3
              text-green-700
              shadow-lg
              dark:border-green-800
              dark:bg-green-950
              dark:text-green-300
            "
          >
            <div
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-green-500
                text-sm
                font-bold
                text-white
              "
            >
              ✓
            </div>

            <div>
              <p className="text-sm font-semibold">
                Profile updated successfully
              </p>

              <p className="text-xs opacity-80">
                Your profile information has been updated.
              </p>
            </div>
          </div>
        )}
      </div>

      <ProfileFollowDialog
        open={followDialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFollowDialog(null);
          }
        }}
        type={
          followDialog === 'following'
            ? 'following'
            : 'followers'
        }
        users={
          followDialog === 'following'
            ? following
            : followers
        }
        loading={
          followDialog === 'following'
            ? followingLoading
            : followersLoading
        }
        loadingMore={
    followDialog === 'following'
      ? followingLoadingMore
      : followersLoadingMore
  }

        hasMore={
          followDialog === "following"
            ? followingHasMore
            : followersHasMore
        }
        onLoadMore={
          followDialog === "following"
            ? onLoadMoreFollowing
            : onLoadMoreFollowers
        }

        onUserClick={onUserClick}

      />
    </>
  );
}

