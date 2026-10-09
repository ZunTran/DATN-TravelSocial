'use client';

import type {
  Comment,
} from '../types/comment.types';

import {
  CommentItem,
} from './comment-item';

interface CommentListProps {
  comments: Comment[];

  currentProfileId?:
    | string
    | null;

  onUpdateComment?: (
    commentId: string,
    content: string,
  ) => Promise<Comment | null>;

  onDeleteComment?: (
    commentId: string,
  ) => Promise<boolean>;

  updating?: boolean;
  deleting?: boolean;
}

export function CommentList({
  comments,
  currentProfileId,
  onUpdateComment,
  onDeleteComment,
  updating = false,
  deleting = false,
}: CommentListProps) {
  return (
    <div className="space-y-5">
      {comments.map(
        (comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentProfileId={
              currentProfileId
            }
            onUpdate={
              onUpdateComment
            }
            onDelete={
              onDeleteComment
            }
            updating={
              updating
            }
            deleting={
              deleting
            }
          />
        ),
      )}
    </div>
  );
}