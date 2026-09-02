"use client";
import Image from "next/image";
import type { PostMedia } from "../types/post.types";
interface PostMediaProps {  media: PostMedia[];}

export function PostMedia({  media,}: PostMediaProps) {
  const sortedMedia = [...media].sort(
    (a, b) =>
      a.displayOrder - b.displayOrder,
  );

  if (sortedMedia.length === 0) {
    return null;
  }

  const getGridClass = () => {
    if (sortedMedia.length === 1) {
      return "grid-cols-1";
    }

    if (sortedMedia.length === 2) {
      return "grid-cols-2";
    }

    if (sortedMedia.length === 3) {
      return "grid-cols-2";
    }

    return "grid-cols-2";
  };

  return (
    <div
      className={`grid gap-1 overflow-hidden ${getGridClass()}`}
    >
      {sortedMedia.map((item, index) => {
        const isVideo =
          item.mediaType === "VIDEO";

        const isSingle =
          sortedMedia.length === 1;

        if (isVideo) {
          return (
            <div
              key={item.id}
              className={
                isSingle
                  ? "relative aspect-video w-full"
                  : "relative aspect-square w-full"
              }
            >
              <video
                src={item.mediaUrl}
                controls
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
          );
        }

        return (
          <div
            key={item.id}
            className={
              isSingle
                ? "relative aspect-video w-full"
                : "relative aspect-square w-full"
            }
          >
            <Image
              src={item.mediaUrl}
              alt={`Post image ${index + 1}`}
              fill
              sizes={
                isSingle
                  ? "(max-width: 768px) 100vw, 680px"
                  : "(max-width: 768px) 50vw, 340px"
              }
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
