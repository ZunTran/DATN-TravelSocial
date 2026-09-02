"use client";

import { Loader2} from "lucide-react";
import { Button} from "@/components/ui/button";

interface LoadMoreProps {
  hasNextPage: boolean;
  loading?: boolean;
  onLoadMore: () => void;
}

export function LoadMore({
  hasNextPage,
  loading = false,
  onLoadMore,
}: LoadMoreProps) {
  if (!hasNextPage) {
    return (
      <div className="py-6 text-center">
        <p className="text-xs text-muted-foreground"> You&apos;re all caught up. </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <Button type="button" variant="outline" disabled={loading}
        onClick={onLoadMore}
        className="min-w-32 rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Load more"
        )}
      </Button>
    </div>
  );
}
