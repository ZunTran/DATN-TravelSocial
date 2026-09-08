"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useProfile } from "@/features/user/hooks/use-profile";
import {
  Image as ImageIcon,
  MapPin,
  Video,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { usePostCrud } from "../hooks/use-post-crud";
import type { Post } from "../types/post.types";
import { POST_FILE_LIMITS, validatePostFile, validateProcessedPostFile } from "@/features/user/utils/post-file";
import { resizeImage } from "@/features/user/utils/resize-image";
import { PostMediaPicker } from "./post-media-picker";

interface CreatePostCardProps {
  onCreated?: (post: Post) => void;
}

export function CreatePostCard({
  onCreated,
}: CreatePostCardProps) {
  const { profile} = useProfile();
  const { createPost,createPostWithFiles, creating } = usePostCrud();

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [error, setError] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [processingFiles, setProcessingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    if (creating || processingFiles) return;

    setOpen(false);
    setContent("");
    setPrivacy("PUBLIC");
    setError("");
    setFiles([]);
    setFileError("");
  };

  const handleSaveDraft = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent && files.length === 0) {
      setError("Please write something before saving.");
      return;
    }

    try {
      setError("");
      setFileError("");

      const post = files.length > 0
        ? await createPostWithFiles(
            {
              content: trimmedContent,
              privacy,
              status: "DRAFT",
            },
            files,
          )
        : await createPost({
            content: trimmedContent,
            privacy,
            status: "DRAFT",
          });

      if (!post) {
        setError("Failed to save draft.");
        return;
      }

      onCreated?.(post);
      toast.success("Đã lưu bài viết vào bản nháp!");
      setOpen(false);
      setContent("");
      setPrivacy("PUBLIC");
      setFiles([]);
      setFileError(""); 
    } catch (error) {
      console.error( "Failed to save draft:", error );
      toast.error("Không thể lưu bài viết.");

      setError( " Something went wrong while saving draft." );
    }
  };

  const handleFilesSelected = async ( event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from( event.target.files ?? []);
    event.target.value = "";
    if (!selectedFiles.length) return;
    
    setFileError("");

    if ( files.length + selectedFiles.length > POST_FILE_LIMITS.maxFiles) {
      setFileError(`Bạn chỉ có thể chọn tối đa ${POST_FILE_LIMITS.maxFiles} file.`);
      return;
    }

    for (const file of selectedFiles) {
      const error =validatePostFile(file);

      if (error) {
        setFileError(error);
        return;
      }
    }

    try {
      setProcessingFiles(true);
      const processedFiles: File[] = [];
      for (const file of selectedFiles) {
        let processedFile = file;

        if (file.type.startsWith( "image/")) processedFile = await resizeImage(file);

        const processedError = validateProcessedPostFile(processedFile );
        if (processedError) {
          setFileError(processedError );
          return;
        }

        processedFiles.push(processedFile);
      }

      setFiles((previous) => [
        ...previous,
        ...processedFiles,
      ]);
    } catch (error) {
      console.error( "Failed to process media:", error,
      );

      setFileError("Không thể xử lý file. Vui lòng thử lại.");
    } finally {
      setProcessingFiles(false);
    }
  };

  const handlePublish = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent && files.length === 0) {
      setError("Please write something before posting.");
      return;
    }

    try {
      setError("");
      setFileError("");

      const post = files.length > 0
       ? await createPostWithFiles(
            {
              content: trimmedContent,
              privacy,
              status: "PUBLISHED",
            },
            files,
          )
        : await createPost({
            content: trimmedContent,
            privacy,
            status: "PUBLISHED",
          });

      if (!post) {
        setError("Failed to create post.");
        return;
      }

      onCreated?.(post);
      toast.success("Đăng bài viết thành công!");
      setOpen(false);
      setContent("");
      setPrivacy("PUBLIC");
      setFiles([]);
      setFileError("");
    } catch (error) {
      console.error( "Failed to create post:", error);
      toast.error("Không thể đăng bài viết.");

      setError( "Something went wrong while creating the post.");
    }
  };

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">

<div className="flex gap-3">
  <Avatar className="size-11 shrink-0">
    {profile?.avatar_url && (
      <AvatarImage
        src={profile.avatar_url}
        alt={profile.username ?? "User"}
      />
    )}

    <AvatarFallback>
      {profile?.username
        ?.charAt(0)
        .toUpperCase() ?? "U"}
    </AvatarFallback>
  </Avatar>

  {/* USERNAME + BUTTON */}
  <div className="min-w-0 flex-1">
    {/* USERNAME */}
    <p className="mb-2 text-sm font-semibold">
      {profile?.username ?? "User"}
    </p>

    {/* CLICKABLE BUTTON */}
    {!open && (
      <button
        type="button"
        onClick={handleOpen}
        className="
          flex
          h-11
          w-full
          items-center
          rounded-full
          bg-muted
          px-4
          text-left
          text-sm
          text-muted-foreground
          transition-colors
          hover:bg-muted/80
          focus:outline-none
          focus:ring-2
          focus:ring-ring
          focus:ring-offset-2
        "
      >
        What's on your mind?
      </button>
    )}
  </div>
</div>

      {!open && (
        <div className="mt-4 border-t pt-3">
          <div className="grid grid-cols-3 gap-1">

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => {
                handleOpen();

                setTimeout(() => {
                  fileInputRef.current?.click();
                }, 0);
              }}

              disabled={ creating || processingFiles }
            >
              <ImageIcon className="size-4 text-green-500" />

              <span className="hidden sm:inline"> Photo / Video </span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleOpen}
            >
              <MapPin className="size-4 text-primary" />
              <span className="hidden sm:inline">
                Location
              </span>
            </Button>

          </div>
        </div>
      )}

      {/* EXPANDED COMPOSER */}
      {open && (
        <div className="mt-4 space-y-4">

          <Textarea
            autoFocus
            value={content}
            onChange={(event) => {
              setContent(event.target.value);

              if (error) { setError(""); }
            }}
            placeholder="What's on your mind?"
            className="min-h-40 resize-none"
            disabled={creating}
          />

            <div className="flex items-center gap-2">
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() =>
      fileInputRef.current?.click()
    }
    disabled={
      creating ||
      processingFiles ||
      files.length >=
        POST_FILE_LIMITS.maxFiles
    }
  >
    {processingFiles ? (
      <>
        <span className="mr-2 size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />

        Đang xử lý...
      </>
    ) : (
      <>
        <ImageIcon className="mr-2 size-4 text-green-500" />

        Photo / Video
      </>
    )}
  </Button>

  <span className="text-xs text-muted-foreground">
    {files.length}/
    {POST_FILE_LIMITS.maxFiles} file
  </span>
</div>
          <input
  ref={fileInputRef}
  type="file"
  accept="
    image/jpeg,
    image/png,
    image/webp,
    image/gif,
    video/mp4,
    video/webm,
    video/quicktime
  "
  multiple
  className="hidden"
  onChange={handleFilesSelected}
  disabled={
    creating ||
    processingFiles
  }
/>

<PostMediaPicker
  files={files}
  onChange={setFiles}
  disabled={
    creating ||
    processingFiles
  }
/>

{fileError && (
  <p className="text-sm text-destructive">
    {fileError}
  </p>
)}

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          {/* PRIVACY */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Privacy:
            </span>

            <select
              value={privacy}
              onChange={(event) =>
                setPrivacy(
                  event.target.value as
                    | "PUBLIC"
                    | "PRIVATE",
                )
              }
              disabled={creating}
              className="
                rounded-md
                border
                bg-background
                px-2
                py-1
                text-sm
              "
            >
              <option value="PUBLIC">
                Public
              </option>

              <option value="PRIVATE">
                Private
              </option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 border-t pt-3">

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={creating || processingFiles}
            >
              Hủy
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={
                creating ||processingFiles || (!content.trim() && files.length === 0)
              }
            >
              {creating
                ? "Đang lưu..."
                : "Lưu nháp"}
            </Button>

            <Button
              type="button"
              onClick={handlePublish}
              disabled={
                creating || processingFiles || (!content.trim() && files.length === 0)
              }
            >
              {creating
                ? "Đang đăng..."
                : "Đăng"}
            </Button>

          </div>
        </div>
      )}
    </section>
  );
}