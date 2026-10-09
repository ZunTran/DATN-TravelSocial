'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { POSTS_QUERY } from '../post/api/post.queries';
import type { Post } from '../post/types/post.types';

interface PostsData {
  posts: {
    items: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface PostFilter {
  authorId?: string;
}

export function usePosts(
  page: number,
  limit: number,
  filter?: PostFilter,
) {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(page);
  const [reloading, setReloading] = useState(false);

  const {
    data,
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery<PostsData>(
    POSTS_QUERY,
    {
      variables: {
        pagination: {
          page,
          limit,
        },
        filter,
      },
      skip: !filter?.authorId,
      fetchPolicy: 'cache-and-network',
    },
  );

  const prependPost = useCallback(
    (post: Post) => {
      setAllPosts((current) => {
        const withoutDuplicate = current.filter(
          (item) => item.id !== post.id,
        );

        return [post, ...withoutDuplicate];
      });
    },
    [],
  );

  const replacePost = useCallback(
    (updatedPost: Post) => {
      setAllPosts((current) =>
        current.map((post) =>
          post.id === updatedPost.id ? updatedPost : post,
        ),
      );
    },
    [],
  );

  const removePost = useCallback(
    (postId: string) => {
      setAllPosts((current) =>
        current.filter((post) => post.id !== postId),
      );
    },
    [],
  );

  const reloadPosts = useCallback(async () => {
    if (!filter?.authorId) {
      return;
    }

    setReloading(true);
    setAllPosts([]);
    setCurrentPage(page);

    try {
      const result = await refetch({
        pagination: {
          page,
          limit,
        },
        filter,
      });

      const refreshedPosts = result.data?.posts?.items ?? [];

      setAllPosts(refreshedPosts);
      setCurrentPage(result.data?.posts?.page ?? page);
    } finally {
      setReloading(false);
    }
  }, [filter, limit, page, refetch]);

  useEffect(() => {
    if (!data?.posts || reloading) {
      return;
    }

    setAllPosts((current) => {
      const serverPosts = data.posts.items;

      if (current.length === 0) {
        return serverPosts;
      }

      const serverIds = new Set(
        serverPosts.map((post) => post.id),
      );

      const localOnlyPosts = current.filter(
        (post) => !serverIds.has(post.id),
      );

      return [...localOnlyPosts, ...serverPosts];
    });

    setCurrentPage(data.posts.page);
  }, [data, reloading]);

  const loadMore = useCallback(
    async () => {
      if (!data?.posts || loading || reloading) {
        return;
      }

      if (currentPage >= data.posts.totalPages) {
        return;
      }

      const nextPage = currentPage + 1;

      const result = await fetchMore({
        variables: {
          pagination: {
            page: nextPage,
            limit,
          },
          filter,
        },
      });

      const newPosts = result.data?.posts?.items ?? [];

      if (newPosts.length === 0) {
        return;
      }

      setAllPosts((prev) => {
        const existingIds = new Set(
          prev.map((post) => post.id),
        );

        const uniquePosts = newPosts.filter(
          (post) => !existingIds.has(post.id),
        );

        return [...prev, ...uniquePosts];
      });

      setCurrentPage(nextPage);
    },
    [
      data,
      currentPage,
      fetchMore,
      limit,
      filter,
      loading,
      reloading,
    ],
  );

  return {
    posts: allPosts,
    total: data?.posts?.total ?? 0,
    loading: loading || reloading,
    error,
    loadingMore: loading && allPosts.length > 0 && !reloading,
    hasMore: !!data?.posts && currentPage < data.posts.totalPages,

    loadMore,
    reloadPosts,
    prependPost,
    replacePost,
    removePost,
  };
}