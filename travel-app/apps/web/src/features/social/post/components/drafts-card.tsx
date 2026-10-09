'use client';

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Post } from '../types/post.types';

interface DraftPostCardProps {
  post: Post;

  onEdit: (
    post: Post,
  ) => void;

  onDelete: (
    postId: string,
  ) => void;

  deleting?: boolean;
}

export default function DraftPostCard({
  post,
  onEdit,
  onDelete,
  deleting = false,
}: DraftPostCardProps) {
  const firstMedia =
    post.media?.[0];

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {firstMedia ? (
          firstMedia.mediaType ===
          'VIDEO' ? (
            <video
              src={firstMedia.mediaUrl}
              className="h-56 w-full object-cover"
              controls
            />
          ) : (
            <img
              src={firstMedia.mediaUrl}
              alt="Draft post"
              className="h-56 w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-56 items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">
              Chưa có hình ảnh
            </span>
          </div>
        )}

        <div className="absolute left-2 top-2">
          <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow">
            Bản nháp
          </span>
        </div>

        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full shadow"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  onEdit(post)
                }
              >
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={deleting}
                className="text-destructive"
                onClick={() =>
                  onDelete(post.id)
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        <p className="line-clamp-3 text-sm">
          {post.content?.trim()
            ? post.content
            : 'Bản nháp chưa có nội dung'}
        </p>

        <div className="mt-3 text-xs text-muted-foreground">
          Cập nhật:{' '}
          {new Date(
            post.updatedAt,
          ).toLocaleString('vi-VN')}
        </div>
      </CardContent>
    </Card>
  );
}