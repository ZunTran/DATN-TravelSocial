"use client";

import { Plus} from "lucide-react";
import { Button} from "@/components/ui/button";

export function StoryCarousel() {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold"> Stories </h2>

          <p className="text-xs text-muted-foreground"> Share your latest adventure  </p>
        </div>

        <Button variant="ghost" size="sm" className="text-xs"> View all </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        <button type="button"
          className="flex w-20 shrink-0 flex-col items-center gap-2"
        >
          <div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed bg-muted">
            <Plus className="size-5 text-muted-foreground" />
          </div>

          <span className="text-xs font-medium"> Your story </span>
        </button>

        <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground"> No stories yet </div>
      </div>
    </div>
  );
}


