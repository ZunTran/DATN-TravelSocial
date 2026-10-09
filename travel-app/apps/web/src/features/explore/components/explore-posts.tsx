'use client';

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
  useSearchPosts,
} from '../hooks/use-search-posts';

interface ExplorePostsProps {
  keyword: string;
}

export function ExplorePosts({
  keyword,
}: ExplorePostsProps) {
  const router = useRouter();

  const {
    posts,
    total,
    loading,
  } = useSearchPosts(
    keyword,
    1,
    5,
  );

  if (!keyword.trim()) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Posts
          </h2>

          <p className="text-sm text-muted-foreground">
            {total} posts found
          </p>
        </div>

        {total > 5 && (
          <Button
            variant="ghost"
            onClick={() =>
              router.push(
                `/explore/posts?keyword=${encodeURIComponent(
                  keyword,
                )}`,
              )
            }
          >
            See more
          </Button>
        )}
      </div>

      {loading && posts.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No posts found.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-lg border p-4"
            >
              <div className="flex items-center gap-2">
                {post.authorAvatar && (
                  <img
                    src={post.authorAvatar}
                    alt={
                      post.authorUsername ??
                      'User'
                    }
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}

                <span className="font-medium">
                  @{post.authorUsername}
                </span>
              </div>

              {post.content && (
                <p className="mt-3 line-clamp-3 text-sm">
                  {post.content}
                </p>
              )}

              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span>
                  {post.likeCount} likes
                </span>

                <span>
                  {post.commentCount} comments
                </span>

                <span>
                  {post.shareCount} shares
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}