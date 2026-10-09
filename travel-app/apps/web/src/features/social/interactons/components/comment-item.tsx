'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Check,
  Loader2,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

import {
  Button,
} from '@/components/ui/button';

import {
  Textarea,
} from '@/components/ui/textarea';

import type {
  Comment,
} from '../types/comment.types';

interface CommentItemProps {
  comment: Comment;

  currentProfileId?: string | null;

  onUpdate?: (
    commentId: string,
    content: string,
  ) => Promise<Comment | null>;

  onDelete?: (
    commentId: string,
  ) => Promise<boolean>;

  updating?: boolean;

  deleting?: boolean;
}

function getInitials(
  username?: string | null,
) {
  if (!username) {
    return 'U';
  }

  const parts =
    username
      .trim()
      .split(/\s+/);

  if (parts.length >= 2) {
    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  }

  return username
    .slice(0, 2)
    .toUpperCase();
}

function formatCommentDate(
  value: string,
) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return new Intl.DateTimeFormat(
    'vi-VN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date);
}

export function CommentItem({
  comment,
  currentProfileId,
  onUpdate,
  onDelete,
  updating = false,
  deleting = false,
}: CommentItemProps) {
  const [
    editing,
    setEditing,
  ] = useState(false);

  const [
    editContent,
    setEditContent,
  ] = useState(
    comment.content,
  );

  const isOwner =
    Boolean(
      currentProfileId &&
        comment.authorId ===
          currentProfileId,
    );

  useEffect(() => {
    if (!editing) {
      setEditContent(
        comment.content,
      );
    }
  }, [
    comment.content,
    editing,
  ]);

  const handleStartEdit =
    () => {
      setEditContent(
        comment.content,
      );

      setEditing(true);
    };

  const handleCancelEdit =
    () => {
      setEditContent(
        comment.content,
      );

      setEditing(false);
    };

  const handleSaveEdit =
    async () => {
      const trimmed =
        editContent.trim();

      if (
        !trimmed ||
        !onUpdate ||
        updating
      ) {
        return;
      }

      const updated =
        await onUpdate(
          comment.id,
          trimmed,
        );

      if (updated) {
        setEditing(false);
      }
    };

  const handleDelete =
    async () => {
      if (
        !onDelete ||
        deleting
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          'Bạn có chắc muốn xóa bình luận này?',
        );

      if (!confirmed) {
        return;
      }

      await onDelete(
        comment.id,
      );
    };

  return (
    <article className="flex gap-3">
      <Avatar className="size-9 shrink-0">
        <AvatarImage
          src={
            comment.author.avatarUrl ??
            undefined
          }
          alt={
            comment.author.username
          }
        />

        <AvatarFallback>
          {getInitials(
            comment.author.username,
          )}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-muted px-4 py-3">
          <div className="mb-1 flex items-start justify-between gap-3">
            <span className="text-sm font-semibold">
              {comment.author.username}
            </span>

            {isOwner &&
              !editing && (
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={
                      handleStartEdit
                    }
                    disabled={
                      deleting ||
                      updating
                    }
                    title="Sửa bình luận"
                  >
                    <Pencil className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={
                      handleDelete
                    }
                    disabled={
                      deleting ||
                      updating
                    }
                    title="Xóa bình luận"
                  >
                    {deleting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              )}
          </div>

          {editing ? (
            <div className="space-y-2">
              <Textarea
                value={
                  editContent
                }
                onChange={(
                  event,
                ) =>
                  setEditContent(
                    event.target.value,
                  )
                }
                rows={3}
                maxLength={2000}
                autoFocus
                disabled={
                  updating
                }
                className="resize-none bg-background"
              />

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {
                    editContent.length
                  }
                  /2000
                </span>

                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={
                      handleCancelEdit
                    }
                    disabled={
                      updating
                    }
                  >
                    <X className="mr-1 size-3.5" />
                    Hủy
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={
                      handleSaveEdit
                    }
                    disabled={
                      updating ||
                      !editContent.trim()
                    }
                  >
                    {updating ? (
                      <Loader2 className="mr-1 size-3.5 animate-spin" />
                    ) : (
                      <Check className="mr-1 size-3.5" />
                    )}

                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-6">
              {comment.content}
            </p>
          )}
        </div>

        <div className="mt-1 px-2 text-xs text-muted-foreground">
          {formatCommentDate(
            comment.createdAt,
          )}
        </div>
      </div>
    </article>
  );
}