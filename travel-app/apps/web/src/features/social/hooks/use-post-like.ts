'use client';

import { useMutation } from '@apollo/client/react';

import {
  LIKE_POST,
  UNLIKE_POST,
} from '../api/like.queries';

import { GET_POSTS } from '../api/post.queries';

interface LikePostData {
  likePost: {
    postId: string;
    userId: string;
    createdAt: string;
  };
}

interface UnlikePostData {
  unlikePost: {
    postId: string;
    userId: string;
    createdAt: string;
  };
}

export function usePostLike() {
  const [likePost, { loading: liking }] =
    useMutation<LikePostData>(LIKE_POST);

  const [unlikePost, { loading: unliking }] =
    useMutation<UnlikePostData>(UNLIKE_POST);

  const toggleLike = async (
    postId: string,
    isLiked: boolean,
  ) => {
    if (isLiked) {
      return unlikePost({
        variables: {
          postId,
        },

        update(cache) {
          cache.modify({
            id: cache.identify({
              __typename: 'PostObject',
              id: postId,
            }),

            fields: {
              isPostLiked() {
                return false;
              },

              likeCount(existingLikeCount: number) {
                return Math.max(
                  0,
                  existingLikeCount - 1,
                );
              },
            },
          });
        },
      });
    }

    return likePost({
      variables: {
        postId,
      },

      update(cache) {
        cache.modify({
          id: cache.identify({
            __typename: 'PostObject',
            id: postId,
          }),

          fields: {
            isPostLiked() {
              return true;
            },

            likeCount(existingLikeCount: number) {
              return existingLikeCount + 1;
            },
          },
        });
      },
    });
  };

  return {
    toggleLike,
    loading: liking || unliking,
  };
}