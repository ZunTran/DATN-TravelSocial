'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Story {
  id: string;
  mediaUrl: string;
  mediaType?: string | null;
  expiresAt: string;
}

interface ProfileStoriesProps {
  stories: Story[];
}

export default function ProfileStories({
  stories,
}: ProfileStoriesProps) {
  const activeStories = stories.filter(
    (story) =>
      new Date(story.expiresAt).getTime() >
      Date.now(),
  );

  if (activeStories.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold">
          Stories
        </h2>

        <p className="text-sm text-muted-foreground">
          Recent stories
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {activeStories.map((story) => (
          <button
            key={story.id}
            type="button"
            className="group flex min-w-[76px] flex-col items-center gap-2"
          >
            <div className="rounded-full bg-gradient-to-tr from-primary via-primary/70 to-muted p-[2px]">
              <Avatar className="h-16 w-16 border-2 border-background">
                <AvatarImage
                  src={story.mediaUrl}
                  alt="Story"
                  className="object-cover"
                />

                <AvatarFallback>
                  ST
                </AvatarFallback>
              </Avatar>
            </div>

            <span className="max-w-[76px] truncate text-xs text-muted-foreground group-hover:text-foreground">
              Story
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}