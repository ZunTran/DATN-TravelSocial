
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import type { PostMedia as PostMediaType } from "../post/types/post.types";
import { MediaLightbox, type LightboxMedia } from "./media-lightbox";

interface PostMediaProps {
  media: PostMediaType[];
}

export function PostMedia({ media }: PostMediaProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log("[POST MEDIA] MOUNT");

    return () => {
      console.log("[POST MEDIA] UNMOUNT");
    };
  }, []);

  console.log("[POST MEDIA STATE]", {
    lightboxOpen,
    currentIndex,
    mediaLength: media.length,
  });

  const sortedMedia = useMemo(
    () => [...media].sort((a, b) => a.displayOrder - b.displayOrder),
    [media],
  );

  if (sortedMedia.length === 0) return null;

  const lightboxMedia: LightboxMedia[] = sortedMedia.map((item) => ({
    id: item.id,
    mediaUrl: item.mediaUrl,
    mediaType: item.mediaType === "VIDEO" ? ("VIDEO" as const) : ("IMAGE" as const),
  }));

  const visibleMedia = sortedMedia.slice(0, 3);
  const remainingCount = sortedMedia.length - 3;

  const openMedia = (index: number) => {
    console.log("[POST MEDIA] OPEN", {
      clickedIndex: index,
      mediaLength: media.length,
    });

    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleClose = () => {
    console.log("[POST MEDIA] onClose CALLED");
    console.trace("[POST MEDIA] CLOSE TRACE");
    setLightboxOpen(false);
  };

  if (sortedMedia.length === 1) {
    const item = sortedMedia[0];

    return (
      <>
        <div className="h-[420px] w-full overflow-hidden bg-muted">
          <MediaItem item={item} index={0} onClick={() => openMedia(0)} single />
        </div>

        <MediaLightbox
          media={lightboxMedia}
          currentIndex={currentIndex}
          open={lightboxOpen}
          onClose={handleClose}
          onIndexChange={setCurrentIndex}
        />
      </>
    );
  }

  if (sortedMedia.length === 2) {
    return (
      <>
        <div className="grid h-[420px] w-full grid-cols-2 gap-1 overflow-hidden bg-muted">
          {visibleMedia.map((item, index) => (
            <MediaItem key={item.id} item={item} index={index} onClick={() => openMedia(index)} />
          ))}
        </div>

        <MediaLightbox
          media={lightboxMedia}
          currentIndex={currentIndex}
          open={lightboxOpen}
          onClose={handleClose}
          onIndexChange={setCurrentIndex}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid h-[420px] w-full grid-cols-3 gap-1 overflow-hidden bg-muted">
        {visibleMedia.map((item, index) => {
          const isThird = index === 2;

          return (
            <MediaItem
              key={item.id}
              item={item}
              index={index}
              onClick={() => openMedia(index)}
              overlay={isThird && remainingCount > 0 ? `+${remainingCount}` : undefined}
            />
          );
        })}
      </div>

      <MediaLightbox
        media={lightboxMedia}
        currentIndex={currentIndex}
        open={lightboxOpen}
        onClose={handleClose}
        onIndexChange={setCurrentIndex}
      />
    </>
  );
}

interface MediaItemProps {
  item: PostMediaType;
  index: number;
  onClick: () => void;
  overlay?: string;
  single?: boolean;
}

function MediaItem({ item, index, onClick, overlay, single = false }: MediaItemProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      onMouseDown={(event) => event.stopPropagation()}
      className="group relative h-full w-full overflow-hidden bg-muted"
    >
      {item.mediaType === "VIDEO" ? (
        <video
          src={item.mediaUrl}
          preload="metadata"
          muted
          playsInline
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <Image
          src={item.mediaUrl}
          alt={`Post media ${index + 1}`}
          fill
          sizes={single ? "(max-width: 768px) 100vw, 680px" : "(max-width: 768px) 33vw, 220px"}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      )}

      {item.mediaType === "VIDEO" && !overlay && (
        <div className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
          <Play className="size-4 fill-current" />
        </div>
      )}

      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white backdrop-blur-[1px]">
          <span className="text-3xl font-semibold">{overlay}</span>
        </div>
      )}

      {overlay && item.mediaType === "VIDEO" && (
        <div className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/50 text-white">
          <Play className="size-4 fill-current" />
        </div>
      )}
    </button>
  );
}

