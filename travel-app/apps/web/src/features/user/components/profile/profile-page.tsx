'use client';

import { useEffect,useState } from 'react';

import ProfileHeader from './profile-header';
import ProfileStats from './profile-stats';
import { ProfileInterests } from './profile-interests';
import ProfileTabs from './profile-tabs';
import ProfileStories from './profile-stories';
import ProfileFollowDialog from './profile-follow-dialog';

import type { UserProfile } from '../../types/profile';
import type { InterestTag } from '../../types/interest';
import type { Post } from '@/features/social/types/post.types';

interface Story {
  id: string;
  mediaUrl: string;
  mediaType?: string | null;
  expiresAt: string;
}

interface FollowUser {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

interface ProfilePageProps {
  profile: UserProfile;

  isOwnProfile: boolean;
  isFollowing?: boolean;

  postCount: number;
  followerCount: number;
  followingCount: number;

  interests: InterestTag[];
  stories: Story[];

  posts: Post[];
  savedPosts?: Post[];

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
  onEditAvatar?: () => void;
  onEditCover?: () => void;
}

export function ProfilePage({
  profile: initialProfile,

  isOwnProfile,
  isFollowing = false,

  postCount,
  followerCount,
  followingCount,

  interests,
  stories,

  posts,
  savedPosts = [],

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
          onEditAvatar={onEditAvatar}
          onEditCover={onEditCover}
        />


        <ProfileStats
          postCount={postCount}
          followerCount={followerCount}
          followingCount={followingCount}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
        />

        <ProfileInterests
          interests={interests}
        />


        <ProfileStories
          stories={stories}
        />


        <ProfileTabs
          isOwnProfile={isOwnProfile}
          profile={profile}
          posts={posts}
          savedPosts={savedPosts}

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
      />
    </>
  );
}

