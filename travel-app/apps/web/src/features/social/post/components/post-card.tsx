"use client";

import {
  Eye,
  MoreHorizontal,
  Tag,
  Trash2,
  Flag,
} from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Post } from "../types/post.types";
import PostActions from "../../components/post-actions";
import { PostLocation } from "../../components/post-location";
import { PostMedia } from "../../components/post-media";
import { usePostCrud } from "../hooks/use-post-crud";
import { useProfile } from "@/features/user/user-profile/hooks/use-profile";

interface PostCardProps {
  post: Post;
  onDeleted?: (postId: string) => void;
}

const REPORT_REASONS = [
  {
    value: "SPAM",
    label: "Spam hoặc quảng cáo",
  },
  {
    value: "INAPPROPRIATE_CONTENT",
    label: "Nội dung không phù hợp",
  },
  {
    value: "HARASSMENT",
    label: "Quấy rối hoặc bắt nạt",
  },
  {
    value: "HATE_SPEECH",
    label: "Ngôn từ gây thù ghét",
  },
  {
    value: "VIOLENCE",
    label: "Bạo lực hoặc nguy hiểm",
  },
  {
    value: "FALSE_INFORMATION",
    label: "Thông tin sai lệch",
  },
  {
    value: "OTHER",
    label: "Lý do khác",
  },
];

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(username?: string | null) {
  if (!username) {
    return "US";
  }

  return username.slice(0, 2).toUpperCase();
}

export function PostCard({
  post,
  onDeleted,
}: PostCardProps) {
  const router = useRouter();
  const { profile } = useProfile();
  const { deletePost, deleting } = usePostCrud();

  const [currentIsLiked, setCurrentIsLiked] =
    useState<boolean>(post.isPostLiked);

  const [currentLikeCount, setCurrentLikeCount] =
    useState<number>(post.likeCount);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [reportDialogOpen, setReportDialogOpen] =
    useState(false);

  const [selectedReportReason, setSelectedReportReason] =
    useState("");

  const [reportError, setReportError] =
    useState("");

  const isOwner =
    Boolean(profile?.id) &&
    profile?.id === post.authorId;

  useEffect(() => {
    setCurrentIsLiked(post.isPostLiked);
    setCurrentLikeCount(post.likeCount);
  }, [post.isPostLiked, post.likeCount]);

  const handleDelete = async () => {
    try {
      const deletedPost = await deletePost(post.id);

      if (!deletedPost) {
        throw new Error("Không thể xóa bài viết.");
      }

      setDeleteDialogOpen(false);
      onDeleted?.(post.id);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleOpenReport = () => {
    setSelectedReportReason("");
    setReportError("");
    setReportDialogOpen(true);
  };

  const handleReport = async () => {
    if (!selectedReportReason) {
      setReportError("Vui lòng chọn lý do báo cáo.");
      return;
    }

    setReportError("");

    console.log("Report post:", {
      postId: post.id,
      reason: selectedReportReason,
    });

    setReportDialogOpen(false);
  };

  return (
    <>
      <article className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start gap-3 p-4">
          <Avatar className="size-11 shrink-0">
            <AvatarImage
              src={post.authorAvatar ?? undefined}
              alt={post.authorUsername ?? "User"}
            />

            <AvatarFallback>
              {getInitials(post.authorUsername)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {post.authorUsername ? (
                <Link
                  href={`/${encodeURIComponent(post.authorUsername)}`}
                  className="truncate text-sm font-semibold hover:underline"
                >
                  {post.authorUsername}
                </Link>
              ) : (
                <span className="truncate text-sm font-semibold">
                  Unknown user
                </span>
              )}

              {post.status === "PUBLISHED" && (
                <span className="shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600">
                  Published
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              <span>{post.privacy}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                disabled={deleting}
              >
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {isOwner ? (
                <>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Xóa bài viết
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleOpenReport}>
                  <Flag className="mr-2 size-4" />
                  Báo cáo bài viết
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-4 pb-4">
          {post.content && (
            <p className="whitespace-pre-wrap text-sm leading-6">
              {post.content}
            </p>
          )}

          {post.category && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Tag className="size-3.5" />
              <span>{post.category.name}</span>
            </div>
          )}

          <PostLocation location={post.location} />

          {(post.hashtags?.length ?? 0) > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {post.hashtags?.map((hashtag) => (
                <span
                  key={hashtag.id}
                  className="text-sm font-medium text-primary"
                >
                  #{hashtag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <PostMedia media={post.media ?? []} />

        <PostActions
          postId={post.id}
          likeCount={currentLikeCount}
          commentCount={post.commentCount}
          shareCount={post.shareCount}
          saveCount={post.saveCount}
          isLiked={currentIsLiked}
          isSaved={post.isPostSaved}
          onLikeChange={(
            nextIsLiked,
            nextLikeCount,
          ) => {
            setCurrentIsLiked(nextIsLiked);
            setCurrentLikeCount(nextLikeCount);
          }}
          onCommentClick={() => {
            router.push(`/post/${post.id}`);
          }}
        />

        <div className="flex items-center gap-1 px-4 pb-3 text-[11px] text-muted-foreground">
          <Eye className="size-3" />
          <span>{post.viewCount} views</span>
        </div>
      </article>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xóa bài viết?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Bài viết sẽ bị xóa và không thể khôi phục.
              Bạn có chắc chắn muốn tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Hủy
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Đang xóa..." : "Xóa bài viết"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Báo cáo bài viết
            </DialogTitle>

            <DialogDescription>
              Hãy chọn lý do bạn muốn báo cáo bài viết này.
            </DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={selectedReportReason}
            onValueChange={setSelectedReportReason}
            className="space-y-3"
          >
            {REPORT_REASONS.map((reason) => (
              <div
                key={reason.value}
                className="flex items-center space-x-3"
              >
                <RadioGroupItem
                  value={reason.value}
                  id={`report-${reason.value}`}
                />

                <Label
                  htmlFor={`report-${reason.value}`}
                  className="cursor-pointer font-normal"
                >
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {reportError && (
            <p className="text-sm text-destructive">
              {reportError}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReportDialogOpen(false)}
            >
              Hủy
            </Button>

            <Button
              type="button"
              onClick={handleReport}
            >
              Gửi báo cáo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PostCard;