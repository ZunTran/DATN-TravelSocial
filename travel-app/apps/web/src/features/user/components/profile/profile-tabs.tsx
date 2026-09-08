
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import PostGrid from '@/features/social/components/post-grid';
import PostGridSkeleton
  from '@/features/social/components/post-grid-skeleton';

import LoadMoreTrigger
  from '@/features/social/components/load-more-trigger';
  
import ProfilePersonalInfo from './profile-personal-info';
import ProfileEdit from './profile-edit';

import type { UserProfile } from '../../types/profile';
import type { Post } from '@/features/social/post/types/post.types';

interface ProfileTabsProps {
  isOwnProfile: boolean;

  profile: UserProfile;

  posts: Post[];

  postsLoading?: boolean;

  postsLoadingMore?: boolean;

  hasMorePosts?: boolean;

  onLoadMorePosts?: () => void;

  savedPosts?: Post[];

  isEditingProfile: boolean;

  onEditProfile?: () => void;

  onCancelEdit?: () => void;

  onProfileUpdated?: (
    profile: UserProfile,
  ) => void;
  onPostCreated?: (post: Post) => void;
}

export default function ProfileTabs({
  isOwnProfile,
  profile,
  posts,

  postsLoading = false,
  postsLoadingMore = false,
  hasMorePosts = false,
  onLoadMorePosts,

  savedPosts = [],

  isEditingProfile,

  onEditProfile,
  onCancelEdit,
  onProfileUpdated,
  onPostCreated,
}: ProfileTabsProps) {
  if (!isOwnProfile) {
    return (
      <div className="w-full">
        <PostGrid posts={posts} />
      </div>
    );
  }

  return (
    <Tabs
      defaultValue="posts"
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">
          Posts
        </TabsTrigger>

        <TabsTrigger value="saved">
          Saved
        </TabsTrigger>

        <TabsTrigger value="personal-info">
          Personal information
        </TabsTrigger>
      </TabsList>

      {/* ====================================================== */}
      {/* POSTS                                                  */}
      {/* ====================================================== */}

<TabsContent
  value="posts"
  className="mt-6"
>
  {postsLoading ? (
    <PostGridSkeleton />
  ) : (
    <>
      <PostGrid posts={posts} />

      {postsLoadingMore && (
        <div className="mt-6">
          <PostGridSkeleton />
        </div>
      )}

      {hasMorePosts && (
        <LoadMoreTrigger
          enabled={
            !postsLoadingMore
          }
          loading={
            postsLoadingMore
          }
          onLoadMore={
            onLoadMorePosts ??
            (() => {})
          }
        />
      )}
    </>
  )}
</TabsContent>

      {/* ====================================================== */}
      {/* SAVED                                                  */}
      {/* ====================================================== */}

      <TabsContent
        value="saved"
        className="mt-6"
      >
        <PostGrid posts={savedPosts} />
      </TabsContent>

      {/* ====================================================== */}
      {/* PERSONAL INFORMATION                                   */}
      {/* ====================================================== */}

      <TabsContent
        value="personal-info"
        className="mt-6"
      >
        {isEditingProfile ? (
          <ProfileEdit
            profile={profile}
            onCancel={onCancelEdit}
            onSuccess={onProfileUpdated}
          />
        ) : (
          <ProfilePersonalInfo
            profile={profile}
            onEditProfile={onEditProfile}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}