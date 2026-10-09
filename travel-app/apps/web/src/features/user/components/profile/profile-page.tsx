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

import type { UserProfile } from '../../user-profile/types/profile';
import type { InterestTag } from '../../user-interest/types/interest';
import type { Post } from '@/features/social/post/types/post.types';
import { CreatePostCard } from '@/features/social/components';
import { FollowUser } from '../../user-interact/types/follow';

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
  onPostDeleted?: (postId: string) => void;

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
  onPostDeleted,

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

const EDITING_DRAFT_STORAGE_KEY = 'travel-social:editing-draft';
const [editingDraft, setEditingDraft] = useState<Post | null>(null);
const [draftRefreshKey, setDraftRefreshKey] = useState(0);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [followDialog, setFollowDialog] = useState< 'followers' | 'following' | null >(null);

  useEffect(() => {
  if (!isOwnProfile) {
    return;
  }

  try {
    const raw = window.sessionStorage.getItem(
      EDITING_DRAFT_STORAGE_KEY,
    );

    if (!raw) {
      return;
    }

    const savedDraft = JSON.parse(raw) as Post;

    if (savedDraft?.id) {
      setEditingDraft(savedDraft);
    }
  } catch (error) {
    console.warn(
      'Cannot restore editing draft:',
      error,
    );

    window.sessionStorage.removeItem(
      EDITING_DRAFT_STORAGE_KEY,
    );
  }
}, [isOwnProfile]);

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


  const handleEditDraft = (post: Post) => {
  setEditingDraft(post);

  try {
    window.sessionStorage.setItem(
      EDITING_DRAFT_STORAGE_KEY,
      JSON.stringify(post),
    );
  } catch (error) {
    console.warn('Cannot persist editing draft:', error,
    );
  }
};

const handleEditCancel = () => {
  setEditingDraft(null);

  try {
    window.sessionStorage.removeItem(
      EDITING_DRAFT_STORAGE_KEY,
    );
  } catch (error) {
    console.warn(
      'Cannot clear editing draft:',
      error,
    );
  }
};

const handleEditSuccess = (post: Post) => {
  setEditingDraft(null);

  try {
    window.sessionStorage.removeItem(
      EDITING_DRAFT_STORAGE_KEY,
    );
  } catch (error) {
    console.warn(
      'Cannot clear editing draft:',
      error,
    );
  }

  setDraftRefreshKey(
    (current) => current + 1,
  );

  onPostCreated?.(post);
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

{isOwnProfile && (
  <CreatePostCard
    editingPost={editingDraft}
    onCreated={(post) => {
      onPostCreated?.(post);
    }}
    onEditSuccess={handleEditSuccess}
    onEditCancel={handleEditCancel}
  />
)}

        <ProfileTabs
          isOwnProfile={isOwnProfile}
          profile={profile}
          posts={posts}
          savedPosts={savedPosts}
          onPostCreated={onPostCreated}
          onPostDeleted={onPostDeleted}

          postsLoading={postsLoading}
          postsLoadingMore={postsLoadingMore}
          hasMorePosts={hasMorePosts}
          onLoadMorePosts={onLoadMorePosts}
  
          isEditingProfile={isEditingProfile}
          onEditProfile={handleEditProfile}
          onCancelEdit={handleCancelEdit}
          onProfileUpdated={handleProfileUpdated}
          onEditDraft={handleEditDraft}
          draftRefreshKey={draftRefreshKey}

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

