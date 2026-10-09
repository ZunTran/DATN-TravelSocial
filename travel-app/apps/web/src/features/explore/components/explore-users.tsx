'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  Button,
} from '@/components/ui/button';

import {
  Loader2,
} from 'lucide-react';

import {
  useSearchUsers,
} from '../hooks/use-search-users';

import {
  ExploreUserItem,
} from './explore-user-item';

interface ExploreUsersProps {
  keyword: string;
  fullPage?: boolean;
}

export function ExploreUsers({
  keyword,
  fullPage = false,
}: ExploreUsersProps) {
  const router = useRouter();

  const [page, setPage] = useState(1);

  const {
    users,
    total,
    totalPages,
    loading,
  } = useSearchUsers(
    keyword,
    page,
    fullPage ? 20 : 10,
  );

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  if (!keyword.trim()) {
    return null;
  }

  const handleFollowed = () => {
    // Reload users after follow/unfollow
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            People
          </h2>

          <p className="text-sm text-muted-foreground">
            {total} users found
          </p>
        </div>

        {!fullPage && total > 10 && (
          <Button
            variant="ghost"
            onClick={() =>
              router.push(
                `/explore/users?keyword=${encodeURIComponent(
                  keyword,
                )}`,
              )
            }
          >
            See more
          </Button>
        )}
      </div>

      {loading && users.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No users found.
        </p>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <ExploreUserItem
              key={user.id}
              user={user}
              onFollowed={handleFollowed}
            />
          ))}
        </div>
      )}

      {fullPage && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            disabled={page <= 1 || loading}
            onClick={() =>
              setPage((current) =>
                Math.max(1, current - 1),
              )
            }
          >
            Previous
          </Button>

          <span className="text-sm">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={
              page >= totalPages || loading
            }
            onClick={() =>
              setPage((current) =>
                Math.min(
                  totalPages,
                  current + 1,
                ),
              )
            }
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}