"use client";

import { MapPin} from "lucide-react";
import type { PostLocation } from "../post/types/post.types";

interface PostLocationProps {
  location?: PostLocation | null;
}

export function PostLocation({ location}: PostLocationProps) {
  if (!location) {
    return null;
  }

  return (
    <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
      <MapPin className="mt-0.5 size-3.5 shrink-0" />

      <div className="min-w-0">
        <p className="truncate">
          {location.name}
        </p>

        {(location.address ||
          location.province) && (
          <p className="truncate text-[11px]">
            {location.address ??
              location.province}
          </p>
        )}
      </div>
    </div>
  );
}
