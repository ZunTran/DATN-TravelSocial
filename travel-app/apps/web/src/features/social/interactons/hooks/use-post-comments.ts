'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useMutation,
  useQuery,
} from '@apollo/client/react';

import {
  POST_COMMENTS_QUERY,
} from '../api/comment.queries';

import {
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from '../api/comment.mutations';



import type {
  Comment,
  CommentList,
} from '../types/comment.types';
import { useAuthContext } from '@/features/auth/context/auth-context';

interface GetPostCommentsResponse {
  comments: CommentList;
}

interface CreateCommentResponse {
  createComment: Comment;
}

interface UpdateCommentResponse {
  updateComment: Comment;
}

interface DeleteCommentResponse {
  deleteComment: boolean;
}

export function usePostComments(postId: string) {
  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();

  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const canQuery =
    Boolean(postId) &&
    !authLoading &&
    isAuthenticated;

  const {
    data,
    loading,
    error,
    refetch,
    fetchMore,
  } = useQuery<GetPostCommentsResponse>(
    POST_COMMENTS_QUERY,
    {
      variables: {
        postId,
        pagination: {
          page: 1,
          limit: 10,
        },
      },

      skip: !canQuery,

      fetchPolicy: 'cache-and-network',

      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    console.log('[COMMENTS] QUERY STATE', {
      postId,
      canQuery,
      authLoading,
      isAuthenticated,
      loading,
      hasData: Boolean(data),
      data,
      error,
    });
  }, [
    postId,
    canQuery,
    authLoading,
    isAuthenticated,
    loading,
    data,
    error,
  ]);


  useEffect(() => {
    console.log('[COMMENTS] DATA EFFECT', {
      postId,
      canQuery,
      hasData: Boolean(data),
      data,
      commentsBefore: comments,
    });

    if (!data?.comments) {
      console.log('[COMMENTS] NO COMMENTS DATA');

      return;
    }

    const commentList = data.comments;

    console.log('[COMMENTS] RECEIVED COMMENTS', {
      items: commentList.items,
      itemsCount: commentList.items?.length ?? 0,
      total: commentList.total,
      page: commentList.page,
      limit: commentList.limit,
      totalPages: commentList.totalPages,
      hasNextPage: commentList.hasNextPage,
    });

    setComments(commentList.items ?? []);

    setCurrentPage(
      commentList.page ?? 1,
    );

    setTotal(
      commentList.total ?? 0,
    );

    setTotalPages(
      commentList.totalPages ?? 0,
    );

    setHasNextPage(
      commentList.hasNextPage ?? false,
    );

    setHasLoadedOnce(true);

    console.log('[COMMENTS] LOCAL STATE SYNCED');
  }, [
    data,
    postId,
    canQuery,
  ]);

  useEffect(() => {
    console.log('[COMMENTS] STATE UPDATED', {
      postId,
      comments,
      commentsCount: comments.length,
      total,
      currentPage,
      totalPages,
      hasNextPage,
      hasLoadedOnce,
      loading,
    });
  }, [
    postId,
    comments,
    total,
    currentPage,
    totalPages,
    hasNextPage,
    hasLoadedOnce,
    loading,
  ]);

  const [
    createCommentMutation,
    {
      loading: creating,
    },
  ] = useMutation<CreateCommentResponse>(
    CREATE_COMMENT,
  );


  const [
    updateCommentMutation,
    {
      loading: updating,
    },
  ] = useMutation<UpdateCommentResponse>(
    UPDATE_COMMENT,
  );


  const [
    deleteCommentMutation,
    {
      loading: deleting,
    },
  ] = useMutation<DeleteCommentResponse>(
    DELETE_COMMENT,
  );


  const refreshComments = useCallback(
    async () => {
      console.log('[COMMENTS] REFRESH START', {
        postId,
      });

      try {
        const result = await refetch({
          postId,
          pagination: {
            page: 1,
            limit: 10,
          },
        });

        console.log(
          '[COMMENTS] REFRESH RESULT',
          result.data,
        );

        const commentList =
          result.data?.comments;

        if (!commentList) {
          console.log(
            '[COMMENTS] REFRESH NO DATA',
          );

          return;
        }

        setComments(
          commentList.items ?? [],
        );

        setCurrentPage(
          commentList.page ?? 1,
        );

        setTotal(
          commentList.total ?? 0,
        );

        setTotalPages(
          commentList.totalPages ?? 0,
        );

        setHasNextPage(
          commentList.hasNextPage ?? false,
        );

        setHasLoadedOnce(true);

        console.log(
          '[COMMENTS] REFRESH STATE UPDATED',
          {
            itemsCount:
              commentList.items?.length ?? 0,
            total: commentList.total,
            page: commentList.page,
            totalPages:
              commentList.totalPages,
            hasNextPage:
              commentList.hasNextPage,
          },
        );
      } catch (refreshError) {
        console.error(
          '[COMMENTS] REFRESH ERROR',
          refreshError,
        );
      }
    },
    [
      postId,
      refetch,
    ],
  );

  const createComment = useCallback(
    async (
      content: string,
      parentCommentId?: string,
    ) => {
      const trimmedContent =
        content.trim();

      if (!trimmedContent) {
        console.log(
          '[COMMENTS] CREATE SKIPPED - EMPTY CONTENT',
        );

        return;
      }

      console.log(
        '[COMMENTS] CREATE START',
        {
          postId,
          content: trimmedContent,
          parentCommentId,
        },
      );

      try {
        const input = {
          postId,
          content: trimmedContent,
          ...(parentCommentId
            ? {
                parentCommentId,
              }
            : {}),
        };

        const result =
          await createCommentMutation({
            variables: {
              input,
            },
          });

        console.log(
          '[COMMENTS] CREATE RESULT',
          result.data,
        );

        const createdComment =
          result.data?.createComment;

        if (!createdComment) {
          console.log(
            '[COMMENTS] CREATE NO COMMENT RETURNED',
          );

          return;
        }

        if (parentCommentId) {
          setComments((prev) => {
            const exists = prev.some(
              (comment) =>
                comment.id ===
                createdComment.id,
            );

            if (exists) {
              return prev;
            }

            return [
              ...prev,
              createdComment,
            ];
          });

          setTotal((prev) => prev + 1);

          console.log(
            '[COMMENTS] REPLY ADDED LOCALLY',
            createdComment,
          );
        } else {
          console.log(
            '[COMMENTS] TOP LEVEL COMMENT CREATED - REFRESHING',
          );

          await refreshComments();
        }
      } catch (createError) {
        console.error(
          '[COMMENTS] CREATE ERROR',
          createError,
        );

        throw createError;
      }
    },
    [
      postId,
      createCommentMutation,
      refreshComments,
    ],
  );

  const updateComment = useCallback(
    async (
      commentId: string,
      content: string,
    ): Promise<Comment | null> => {
      const trimmedContent =
        content.trim();

      if (!trimmedContent) {
        console.log(
          '[COMMENTS] UPDATE SKIPPED - EMPTY CONTENT',
        );

        return null;
      }

      console.log(
        '[COMMENTS] UPDATE START',
        {
          commentId,
          content: trimmedContent,
        },
      );

      try {
        const result =
          await updateCommentMutation({
            variables: {
              input: {
                commentId,
                content: trimmedContent,
              },
            },
          });

        console.log(
          '[COMMENTS] UPDATE RESULT',
          result.data,
        );

        const updatedComment =
          result.data?.updateComment;

        if (!updatedComment) {
          console.log(
            '[COMMENTS] UPDATE NO COMMENT RETURNED',
          );

          return null;
        }

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? updatedComment
              : comment,
          ),
        );

        console.log(
          '[COMMENTS] UPDATE STATE DONE',
          updatedComment,
        );

        return updatedComment;
      } catch (updateError) {
        console.error(
          '[COMMENTS] UPDATE ERROR',
          updateError,
        );

        throw updateError;
      }
    },
    [
      updateCommentMutation,
    ],
  );

  const deleteComment = useCallback(
    async (
      commentId: string,
    ): Promise<boolean> => {
      console.log(
        '[COMMENTS] DELETE START',
        {
          commentId,
        },
      );

      try {
        const result =
          await deleteCommentMutation({
            variables: {
              commentId,
            },
          });

        console.log(
          '[COMMENTS] DELETE RESULT',
          result.data,
        );

        const deleted =
          result.data?.deleteComment;

        if (!deleted) {
          console.log(
            '[COMMENTS] DELETE FAILED',
          );

          return false;
        }

        setComments((prev) =>
          prev.filter(
            (comment) =>
              comment.id !== commentId,
          ),
        );

        setTotal((prev) =>
          Math.max(0, prev - 1),
        );

        console.log(
          '[COMMENTS] DELETE LOCAL STATE DONE',
        );

        await refreshComments();

        return true;
      } catch (deleteError) {
        console.error(
          '[COMMENTS] DELETE ERROR',
          deleteError,
        );

        throw deleteError;
      }
    },
    [
      deleteCommentMutation,
      refreshComments,
    ],
  );

  const loadMore = useCallback(
    async () => {
      if (
        loadingMore ||
        !hasNextPage ||
        currentPage >= totalPages
      ) {
        console.log(
          '[COMMENTS] LOAD MORE SKIPPED',
          {
            loadingMore,
            hasNextPage,
            currentPage,
            totalPages,
          },
        );

        return;
      }

      const nextPage =
        currentPage + 1;

      console.log(
        '[COMMENTS] LOAD MORE START',
        {
          postId,
          currentPage,
          nextPage,
          totalPages,
        },
      );

      setLoadingMore(true);

      try {
        const result =
          await fetchMore({
            variables: {
              postId,
              pagination: {
                page: nextPage,
                limit: 10,
              },
            },
          });

        console.log(
          '[COMMENTS] LOAD MORE RESULT',
          result.data,
        );

        const commentList =
          result.data?.comments;

        if (!commentList) {
          console.log(
            '[COMMENTS] LOAD MORE NO DATA',
          );

          return;
        }

        setComments((prev) => {
          const existingIds =
            new Set(
              prev.map(
                (comment) =>
                  comment.id,
              ),
            );

          const newComments =
            (commentList.items ?? []).filter(
              (comment) =>
                !existingIds.has(
                  comment.id,
                ),
            );

          console.log(
            '[COMMENTS] APPEND COMMENTS',
            {
              previousCount: prev.length,
              receivedCount:
                commentList.items?.length ??
                0,
              newCount:
                newComments.length,
            },
          );

          return [
            ...prev,
            ...newComments,
          ];
        });

        setCurrentPage(
          commentList.page ??
            nextPage,
        );

        setTotal(
          commentList.total ?? total,
        );

        setTotalPages(
          commentList.totalPages ??
            totalPages,
        );

        setHasNextPage(
          commentList.hasNextPage ??
            false,
        );
      } catch (loadMoreError) {
        console.error(
          '[COMMENTS] LOAD MORE ERROR',
          loadMoreError,
        );
      } finally {
        setLoadingMore(false);

        console.log(
          '[COMMENTS] LOAD MORE END',
        );
      }
    },
    [
      postId,
      fetchMore,
      loadingMore,
      hasNextPage,
      currentPage,
      totalPages,
      total,
    ],
  );

  console.log('[COMMENTS] HOOK RETURN', {
    postId,
    canQuery,
    loading,
    authLoading,
    isAuthenticated,
    commentsCount: comments.length,
    total,
    currentPage,
    totalPages,
    hasNextPage,
    hasLoadedOnce,
    loadingMore,
    creating,
    updating,
    deleting,
    error,
  });

  return {
    comments,
    total,
    currentPage,
    totalPages,
    hasNextPage,
    hasLoadedOnce,

    loading:
      authLoading || loading,

    loadingMore,

    creating,
    updating,
    deleting,

    error,

    isAuthenticated,
    authLoading,

    createComment,
    updateComment,
    deleteComment,
    loadMore,
    refreshComments,
  };
}