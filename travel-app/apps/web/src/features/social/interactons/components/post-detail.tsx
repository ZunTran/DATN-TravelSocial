'use client';


import {
  usePostDetail,
} from '../../post/hooks/use-post-detail';

import {
  PostCard,
} from '../../components';
import CommentSection from './comment-section';

interface PostDetailProps {
  postId: string;
}

export function PostDetail({
  postId,
}: PostDetailProps) {
  const {
    post,
    postLoading,
    postError,
  } = usePostDetail(
    postId,
  );


  if (postLoading) {
    return (
      <main className="mx-auto max-w-2xl p-4">
        <div className="animate-pulse rounded-2xl border p-6">
          Đang tải bài viết...
        </div>
      </main>
    );
  }

  if (
    postError ||
    !post
  ) {
    return (
      <main className="mx-auto max-w-2xl p-4">
        <div className="rounded-2xl border p-6 text-sm text-muted-foreground">
          Không tìm thấy bài viết.
        </div>
      </main>
    );
  }


  return (
    <main className="mx-auto max-w-2xl space-y-6 p-4">
      <PostCard
        post={post}
      />

      <CommentSection
        postId={postId}
      />
    </main>
  );
}