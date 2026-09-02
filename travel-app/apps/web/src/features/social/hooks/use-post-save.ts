"use client";

import { useMutation } from "@apollo/client/react";

import {
  SAVE_POST,
  UNSAVE_POST,
} from "../api/save.queries";

interface SavePostResponse {
  savePost: {
    postId: string;
    userId: string;
    savedAt: string;
  };
}

interface UnsavePostResponse {
  unsavePost: {
    postId: string;
    userId: string;
    savedAt: string;
  };
}

export function usePostSave() {
  const [savePost, { loading: saving }] =
    useMutation<SavePostResponse>(SAVE_POST);

  const [unsavePost, { loading: unsaving }] =
    useMutation<UnsavePostResponse>(UNSAVE_POST);

  const toggleSave = async (
    postId: string,
    isSaved: boolean,
  ) => {
    if (isSaved) {
      return unsavePost({
        variables: {
          postId,
        },
      });
    }

    return savePost({
      variables: {
        postId,
      },
    });
  };

  return {
    toggleSave,
    loading: saving || unsaving,
  };
}