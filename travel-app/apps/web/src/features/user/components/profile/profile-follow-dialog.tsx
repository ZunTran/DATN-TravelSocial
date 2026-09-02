'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FollowUser {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

interface ProfileFollowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  type: 'followers' | 'following';

  users: FollowUser[];

  loading?: boolean;
}

export default function ProfileFollowDialog({
  open,
  onOpenChange,
  type,
  users,
  loading = false,
}: ProfileFollowDialogProps) {
  const title =
    type === 'followers'
      ? 'Followers'
      : 'Following';

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[80vh] overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
          {loading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />

                  <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No {type} yet.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {users.map((user) => {
                const name =
                  user.displayName ||
                  user.username;

                return (
                  <button
                    key={user.id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <Avatar className="h-11 w-11">
                      <AvatarImage
                        src={user.avatarUrl ?? undefined}
                        alt={name}
                      />

                      <AvatarFallback>
                        {name
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}