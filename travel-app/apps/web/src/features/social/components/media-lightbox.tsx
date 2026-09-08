
"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LightboxMedia {
  id?: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
}

interface MediaLightboxProps {
  media: LightboxMedia[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function MediaLightbox({
  media,
  currentIndex,
  open,
  onClose,
  onIndexChange,
}: MediaLightboxProps) {
  const currentMedia = media[currentIndex];

  const handleNext = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (media.length <= 1) return;

      onIndexChange((currentIndex + 1) % media.length);
    },
    [currentIndex, media.length, onIndexChange],
  );

  const handlePrevious = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (media.length <= 1) return;

      const previousIndex =
        currentIndex === 0 ? media.length - 1 : currentIndex - 1;

      onIndexChange(previousIndex);
    },
    [currentIndex, media.length, onIndexChange],
  );

  const handleClose = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      event?.preventDefault();
      event?.stopPropagation();
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (media.length <= 1) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onIndexChange((currentIndex + 1) % media.length);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange(
          currentIndex === 0 ? media.length - 1 : currentIndex - 1,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, currentIndex, media.length, onClose, onIndexChange]);

  if (!open || !currentMedia || typeof document === "undefined") {
    return null;
  }

  const hasMultiple = media.length > 1;

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const lightbox = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={handleClose}
        className="absolute right-4 top-4 z-[100001] size-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
        aria-label="Close media viewer"
      >
        <X className="size-6" />
      </Button>

      {hasMultiple && (
        <div
          className="absolute left-1/2 top-5 z-[100001] -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {currentIndex + 1} / {media.length}
        </div>
      )}

      {hasMultiple && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={handlePrevious}
          className="absolute left-3 top-1/2 z-[100001] size-11 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
          aria-label="Previous media"
        >
          <ChevronLeft className="size-7" />
        </Button>
      )}

      <div
        className="relative z-[100000] flex max-h-[90vh] max-w-[90vw] items-center justify-center"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {currentMedia.mediaType === "VIDEO" ? (
          <video
            key={currentMedia.mediaUrl}
            src={currentMedia.mediaUrl}
            controls
            autoPlay
            playsInline
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        ) : (
          <Image
            key={currentMedia.mediaUrl}
            src={currentMedia.mediaUrl}
            alt={`Media ${currentIndex + 1}`}
            width={1600}
            height={1200}
            sizes="90vw"
            priority
            className="max-h-[90vh] w-auto max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        )}
      </div>

      {hasMultiple && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={handleNext}
          className="absolute right-3 top-1/2 z-[100001] size-11 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
          aria-label="Next media"
        >
          <ChevronRight className="size-7" />
        </Button>
      )}
    </div>
  );

  return createPortal(lightbox, document.body);
}

