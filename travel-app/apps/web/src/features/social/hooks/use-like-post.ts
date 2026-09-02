"use client";

import { useMutation} from "@apollo/client/react";
import { LIKE_POST, UNLIKE_POST} from "../api/like.queries";

export function useLikePost() {
  const [likeMutation, { loading: liking } ] = useMutation( LIKE_POST,);
  const [ unlikeMutation, { loading: unliking}] = useMutation( UNLIKE_POST,);

  const likePost = ( postId: string) =>
    likeMutation({
      variables: { postId},
    });

  const unlikePost = ( postId: string ) =>
    unlikeMutation({
      variables: { postId},
    });

  return {
    likePost,
    unlikePost,
    loading: liking || unliking,
  };
}