'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import PostGrid from '@/features/social/components/post-grid';
import PostGridSkeleton from '@/features/social/components/post-grid-skeleton';
import LoadMoreTrigger from '@/features/social/components/load-more-trigger';
import ProfilePersonalInfo from './profile-personal-info';
import ProfileEdit from './profile-edit';
import type { UserProfile } from '../../user-profile/types/profile';
import type { Post } from '@/features/social/post/types/post.types';
import ChangePasswordForm from '@/features/auth/components/change-password-form';
import { useState } from 'react';
import MyDraftPosts from '@/features/social/post/components/my-drafts';

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
  onProfileUpdated?: (profile: UserProfile) => void;
  onPostCreated?: (post: Post) => void;
  onPostDeleted?: (postId: string) => void;
  onEditDraft?: (post: Post) => void;
  draftRefreshKey?: number;
}

export default function ProfileTabs({
  isOwnProfile,
  profile,
  posts,
  postsLoading = false,
  postsLoadingMore = false,
  hasMorePosts = false,
  onLoadMorePosts,
  isEditingProfile,
  onEditProfile,
  onCancelEdit,
  onProfileUpdated,
  onPostCreated,
  onPostDeleted,
  onEditDraft,
  draftRefreshKey = 0,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('posts');

  if (!isOwnProfile) {
    return (
      <div className="w-full">
        <PostGrid posts={posts} onPostDeleted={onPostDeleted} />
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="drafts">My Draft</TabsTrigger>
        <TabsTrigger value="personal-info">Personal information</TabsTrigger>
        <TabsTrigger value="change-password">Change password</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        {postsLoading ? (
          <PostGridSkeleton />
        ) : (
          <>
            <PostGrid posts={posts} onPostDeleted={onPostDeleted} />

            {postsLoadingMore && (
              <div className="mt-6">
                <PostGridSkeleton />
              </div>
            )}

            {hasMorePosts && (
              <LoadMoreTrigger
                enabled={!postsLoadingMore}
                loading={postsLoadingMore}
                onLoadMore={onLoadMorePosts ?? (() => {})}
              />
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="drafts" className="mt-6">
        <MyDraftPosts
          enabled={activeTab === 'drafts'}
          onEditPost={onEditDraft}
          refreshKey={draftRefreshKey}
        />
      </TabsContent>

      <TabsContent value="personal-info" className="mt-6">
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

      <TabsContent value="change-password" className="mt-6">
        <ChangePasswordForm
          onSuccess={() => {
            window.location.replace('/login');
          }}
        />
      </TabsContent>
    </Tabs>
  );
}