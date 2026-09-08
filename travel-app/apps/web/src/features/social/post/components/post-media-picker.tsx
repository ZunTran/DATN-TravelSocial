"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ImageIcon,
  Video,
  X,
} from "lucide-react";
import { formatFileSize } from "@/features/user/utils/post-file";



interface PostMediaPickerProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

function MediaPreview({
  file,
}: {
  file: File;
}) {
  const [url, setUrl] =
    useState("");

  useEffect(() => {
    const objectUrl =
      URL.createObjectURL(file);

    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!url) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  if (
    file.type.startsWith("video/")
  ) {
    return (
      <video
        src={url}
        className="h-full w-full object-cover"
        muted
        playsInline
      />
    );
  }

  return (
    <img
      src={url}
      alt={file.name}
      className="h-full w-full object-cover"
    />
  );
}

export function PostMediaPicker({
  files,
  onChange,
  disabled = false,
}: PostMediaPickerProps) {
  if (!files.length) {
    return null;
  }

  const handleRemove = (
    index: number,
  ) => {
    if (disabled) return;

    onChange(
      files.filter(
        (_, fileIndex) =>
          fileIndex !== index,
      ),
    );
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {files.map((file, index) => {
          const isVideo =
            file.type.startsWith(
              "video/",
            );

          return (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="group relative overflow-hidden rounded-xl border bg-muted"
            >
              <div className="aspect-square">
                <MediaPreview
                  file={file}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  handleRemove(index)
                }
                disabled={disabled}
                className="
                  absolute
                  right-2
                  top-2
                  flex
                  size-7
                  items-center
                  justify-center
                  rounded-full
                  bg-black/70
                  text-white
                  opacity-0
                  transition
                  group-hover:opacity-100
                  disabled:cursor-not-allowed
                "
              >
                <X className="size-4" />
              </button>

              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white">
                <div className="flex items-center gap-1">
                  {isVideo ? (
                    <Video className="size-3.5" />
                  ) : (
                    <ImageIcon className="size-3.5" />
                  )}

                  <span className="truncate text-[11px]">
                    {file.name}
                  </span>
                </div>

                <p className="text-[10px] opacity-80">
                  {formatFileSize(
                    file.size,
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}