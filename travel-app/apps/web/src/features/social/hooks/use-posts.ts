'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '../api/post.queries';
import type { Post } from '../types/post.types';

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

  const {
    data,
    loading,
    error,
    fetchMore,
  } = useQuery<PostsData>(GET_POSTS, {
    variables: {
      pagination: {
        page,
        limit,
      },
      filter,
    },
    skip: !filter?.authorId,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (!data?.posts?.items) return;

    setAllPosts(data.posts.items);
    setCurrentPage(data.posts.page);
  }, [data]);

  const loadMore = useCallback(async () => {
    if (
      !data?.posts ||
      loading
    ) {
      return;
    }

    if (
      currentPage >= data.posts.totalPages
    ) {
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

    const newPosts =
      result.data?.posts?.items ?? [];

    if (newPosts.length === 0) {
      return;
    }

    setAllPosts((prev) => {
      const existingIds = new Set(
        prev.map((post) => post.id),
      );

      const uniquePosts =
        newPosts.filter(
          (post) => !existingIds.has(post.id),
        );

      return [
        ...prev,
        ...uniquePosts,
      ];
    });

    setCurrentPage(nextPage);
  }, [
    data,
    currentPage,
    fetchMore,
    limit,
    filter,
    loading,
  ]);

  return {
    posts: allPosts,

    total:
      data?.posts?.total ?? 0,

    loading,

    error,

    loadingMore: loading && allPosts.length > 0,

    hasMore:
      !!data?.posts &&
      currentPage <
        data.posts.totalPages,

    loadMore,
  };
}