'use client';

import {
  useProfile,
} from '@/features/user/user-profile/hooks/use-profile';

import {
  usePostComments,
} from '../hooks/use-post-comments';

import {
  CommentInput,
} from './comment-input';

import {
  CommentList,
} from './comment-list';

interface CommentSectionProps {
  postId: string;
}

function CommentSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex gap-3"
        >
          <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />

            <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentSection({
  postId,
}: CommentSectionProps) {
  const {
    profile,
    loading: profileLoading,
  } = useProfile();

  const {
    comments,
    total,
    hasNextPage,
    loading,
    loadingMore,
    creating,
    updating,
    deleting,
    error,
    createComment,
    updateComment,
    deleteComment,
    loadMore,
  } = usePostComments(postId);

  const handleCreateComment = async (
    content: string,
  ) => {
    await createComment(content);
  };

  return (
    <section className="rounded-2xl border bg-card p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          Bình luận
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {total} bình luận
        </p>
      </div>

      {!profileLoading && profile && (
        <div className="mb-6 flex items-start gap-3">
          <img
            src={
              profile.avatar_url || '/avatar-placeholder.png'}
            alt={profile.username}
            className="size-9 shrink-0 rounded-full object-cover"
          />

          <div className="min-w-0 flex-1">
            <p className="mb-2 text-sm font-medium">
              {profile.username}
            </p>

            <CommentInput
              onSubmit={handleCreateComment}
              loading={creating}
            />
          </div>
        </div>
      )}

{error && (
  <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
    Không thể tải bình luận.
    Vui lòng thử lại.
  </div>
)}

{loading && comments.length === 0 && (
  <CommentSkeleton />
)}

{!loading &&
  !error &&
  comments.length === 0 && (
    <div className="py-8 text-center text-sm text-muted-foreground">
      Chưa có bình luận nào
    </div>
  )}

{comments.length > 0 && (
  <>
    <CommentList
      comments={comments}
      currentProfileId={
        profile?.id ?? null
      }
      onUpdateComment={
        updateComment
      }
      onDeleteComment={
        deleteComment
      }
      updating={updating}
      deleting={deleting}
    />

    {hasNextPage && (
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingMore
            ? 'Đang tải...'
            : 'Xem thêm bình luận'}
        </button>
      </div>
    )}
  </>
)}
    </section>
  );
}

export default CommentSection;