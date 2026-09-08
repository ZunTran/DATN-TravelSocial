"use client";

import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

import { useMutation } from "@apollo/client/react";

import { Button } from "@/components/ui/button";

import { usePostLike } from "../hooks/use-post-like";
import { usePostSave } from "../hooks/use-post-save";

import { SHARE_POST } from "../api/share.queries";
import { useEffect, useState } from "react";

interface PostActionsProps {
  postId: string;

  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;

  isLiked: boolean;
  isSaved: boolean;

  onLikeChange?: (
    isLiked: boolean,
    likeCount: number,
  ) => void;

  onComment?: () => void;
}

interface SharePostResponse {
  sharePost: {
    id: string;
    postId: string;
    userId: string;
    createdAt: string;
  };
}

export function PostActions({
  postId,

  likeCount,
  commentCount,
  shareCount,
  saveCount,

  isLiked,
  isSaved,

  onLikeChange,
  onComment,
}: PostActionsProps) {

  const [localIsSaved, setLocalIsSaved] =
  useState(isSaved);

  const [localSaveCount, setLocalSaveCount] =
    useState(saveCount);

  const [localShareCount, setLocalShareCount] =
    useState(shareCount);

  const {
    toggleLike,
    loading: likeLoading,
  } = usePostLike();

  const {
    toggleSave,
    loading: saveLoading,
  } = usePostSave();

  const [
    sharePost,
    {
      loading: shareLoading,
    },
  ] = useMutation<SharePostResponse>(
    SHARE_POST,
  );

  useEffect(() => {
    setLocalSaveCount(saveCount);
  }, [saveCount]);

  useEffect(() => {
    setLocalShareCount(shareCount);
  }, [shareCount]);

  useEffect(() => {
  setLocalIsSaved(isSaved);
}, [isSaved]);

  const handleLike = async () => {
    if (likeLoading) {
      return;
    }

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    const nextIsLiked =
      !previousIsLiked;

    const nextLikeCount =
      nextIsLiked
        ? previousLikeCount + 1
        : Math.max(
            0,
            previousLikeCount - 1,
          );


    onLikeChange?.(
      nextIsLiked,
      nextLikeCount,
    );

    try {

      await toggleLike(
        postId,
        previousIsLiked,
      );
    } catch (error) {


      onLikeChange?.(
        previousIsLiked,
        previousLikeCount,
      );

      console.error(
        "Failed to toggle like",
        error,
      );
    }
  };

  /*
   * ============================================================
   * SAVE
   * ============================================================
   */

  const handleSave = async () => {
    if (saveLoading) {
      return;
    }

    const previousIsSaved = localIsSaved;
    const previousSaveCount = localSaveCount;

    const nextIsSaved =!previousIsSaved;

    const nextSaveCount = nextIsSaved ? previousSaveCount + 1
        : Math.max( 0, previousSaveCount - 1);

    setLocalIsSaved(nextIsSaved);
    setLocalSaveCount(nextSaveCount);

    try {
      await toggleSave(
        postId,
        previousIsSaved,
      );
    } catch (error) {

      setLocalIsSaved(previousIsSaved);
      setLocalSaveCount(previousSaveCount);

      console.error("Failed to toggle save", error);
    }
  };


  const handleShare = async () => {
    if (shareLoading) 
      return; 

    try {
      await sharePost({
        variables: {
          postId,
        },
      });

      setLocalShareCount( (count) => count + 1 );
    } catch (error) {
      console.error( "Failed to share post", error );
    }
  };


  return (
    <div className="border-t">

      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        <span>
          {likeCount} likes
        </span>

        <div className="flex gap-3">
          <span>
            {commentCount} comments
          </span>

          <span>
            {localShareCount} shares
          </span>

          {localSaveCount > 0 && (
            <span>
              {localSaveCount} saves
            </span>
          )}
        </div>
      </div>


      <div className="grid grid-cols-4 px-2 pb-1">

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={likeLoading}
          onClick={handleLike}
          className={
            isLiked
              ? "gap-2 text-red-500 hover:text-red-600"
              : "gap-2"
          }
        >
          <Heart
            className="size-4"
            fill={
              isLiked
                ? "currentColor"
                : "none"
            }
          />

          <span className="hidden sm:inline">
            Like
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onComment}
          className="gap-2"
        >
          <MessageCircle className="size-4" />

          <span className="hidden sm:inline">
            Comment
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={shareLoading}
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="size-4" />

          <span className="hidden sm:inline">
            Share
          </span>
        </Button>


        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={saveLoading}
          onClick={handleSave}
          className={
            isSaved
              ? "gap-2 text-primary"
              : "gap-2"
          }
        >
          <Bookmark
            className="size-4"
            fill={
              localIsSaved
                ? "currentColor"
                : "none"
            }
          />

          <span className="hidden sm:inline">
            Save
          </span>
        </Button>
      </div>
    </div>
  );
}


export default PostActions;

