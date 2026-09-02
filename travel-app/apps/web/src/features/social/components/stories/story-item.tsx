"use client";

// import Image from "next/image";
import { Avatar,  AvatarFallback,  AvatarImage} from "@/components/ui/avatar";
import type { StoryGroup} from "../../types/story.types";

interface StoryItemProps {
  story: StoryGroup;
  onClick?: () => void;
}

export function StoryItem({story, onClick,}: StoryItemProps) {
  return (
    <button type="button" onClick={onClick} className="group flex w-20 shrink-0 flex-col items-center gap-2" >
      <div
        className={ story.hasUnviewedStories
            ? "rounded-full bg-gradient-to-tr from-primary via-purple-500 to-pink-500 p-[2px]"
            : "rounded-full bg-muted p-[2px]"}
      >
        <Avatar className="size-16 border-2 border-background">
          <AvatarImage src={  story.avatarUrl ?? undefined }
            alt={ story.username ?? "User" }
          />

          <AvatarFallback>
            {story.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <span className="w-full truncate text-center text-xs">
        {story.username}
      </span>
    </button>
  );
}
