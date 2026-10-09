'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PostGridSkeleton from '@/features/social/components/post-grid-skeleton';
import { usePostCrud } from '../hooks/use-post-crud';
import type { Post } from '../types/post.types';
import { useMyDraftPosts } from '../hooks/use-my-drafts';
import DraftPostCard from './drafts-card';

interface MyDraftPostsProps {
  enabled?: boolean;

  onEditPost?: (
    post: Post,
  ) => void;

  refreshKey?: number;
}

export default function MyDraftPosts({
  enabled = false,
  onEditPost,
   refreshKey = 0,

}: MyDraftPostsProps) {
  const [page, setPage] =
    useState(1);

  const {
    posts,
    pagination,
    loading,
    refetch,
  } = useMyDraftPosts(
    page,
    5,
    enabled,
  );

  useEffect(() => {
  if (!enabled) {
    return;
  }

  void refetch();
}, [
  refreshKey,
  enabled,
  refetch,
]);

  const {
    deletePost,
    deleting,
  } = usePostCrud();

  const handleDelete = async (
    postId: string,
  ) => {
    const confirmed =
      window.confirm(
        'Bạn có chắc muốn xóa bản nháp này không?',
      );

    if (!confirmed) {
      return;
    }

    try {
      const result =
        await deletePost(postId);

      if (!result) {
        return;
      }

      if (
        posts.length === 1 &&
        page > 1
      ) {
        setPage(
          (current) =>
            current - 1,
        );

        return;
      }

      await refetch();
    } catch (error) {
      console.error(
        'Delete draft failed:',
        error,
      );
    }
  };

  if (!enabled) {
    return null;
  }

  if (
    loading &&
    posts.length === 0
  ) {
    return <PostGridSkeleton />;
  }

  if (
    !loading &&
    posts.length === 0
  ) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border">
        <div className="text-center">
          <p className="font-medium">
            Chưa có bản nháp
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Các bài viết lưu ở trạng thái
            bản nháp sẽ xuất hiện ở đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          My Draft
        </h3>

        <p className="text-sm text-muted-foreground">
          {pagination?.total ?? 0}/10 bản nháp
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <DraftPostCard
            key={post.id}
            post={post}
            onEdit={
              onEditPost ??
              (() => {})
            }
            onDelete={handleDelete}
            deleting={deleting}
          />
        ))}
      </div>

      {pagination &&
        pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={
                page === 1 ||
                loading
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current - 1,
                )
              }
            >
              Previous
            </Button>

            <span className="text-sm">
              Trang {page} /{' '}
              {pagination.totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              disabled={
                !pagination.hasNextPage ||
                loading
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1,
                )
              }
            >
              Next
            </Button>
          </div>
        )}
    </div>
  );
}