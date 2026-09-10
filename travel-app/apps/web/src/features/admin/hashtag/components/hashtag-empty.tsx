import {
  Hash,
} from 'lucide-react';

export function HashtagEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Hash className="mb-4 h-10 w-10 text-muted-foreground" />

      <h3 className="text-lg font-semibold">
        No hashtags found
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Try another search or create a new hashtag.
      </p>
    </div>
  );
}