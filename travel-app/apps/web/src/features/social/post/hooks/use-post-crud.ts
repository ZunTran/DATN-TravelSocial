'use client';

import { useMutation } from '@apollo/client/react';

import {
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  CREATE_POST_WITH_FILES,
  UPDATE_POST_WITH_FILES,
} from '../api/post.mutations';

import type {
  CreatePostInput,
  Post,
  UpdatePostInput,
} from '../types/post.types';

interface CreatePostResponse {
  createPost: Post;
}

interface UpdatePostResponse {
  updatePost: Post;
}

interface DeletePostResponse {
  deletePost: {
    id: string;
    status: string;
  };
}

interface CreatePostWithFilesResponse {
  createPostWithFiles: Post;
}

interface UpdatePostWithFilesResponse {
  updatePostWithFiles: Post;
}

export function usePostCrud() {
  const [
    createPostMutation,
    { loading: creating },
  ] = useMutation<CreatePostResponse>(
    CREATE_POST,
  );

  const [
    createPostWithFilesMutation,
    { loading: creatingWithFiles },
  ] = useMutation<CreatePostWithFilesResponse>(
    CREATE_POST_WITH_FILES,
  );

  const [
    updatePostMutation,
    { loading: updating },
  ] = useMutation<UpdatePostResponse>(
    UPDATE_POST,
  );

  const [
    updatePostWithFilesMutation,
    { loading: updatingWithFiles },
  ] = useMutation<UpdatePostWithFilesResponse>(
    UPDATE_POST_WITH_FILES,
  );

  const [
    deletePostMutation,
    { loading: deleting },
  ] = useMutation<DeletePostResponse>(
    DELETE_POST,
  );

  const createPost = async ( input: CreatePostInput ) => {
    const result = await createPostMutation({
        variables: { input },
      });

    return result.data?.createPost ?? null;
  };

  const createPostWithFiles = async (
    input: CreatePostInput,
    files: File[]) => {
    const result =
      await createPostWithFilesMutation({
        variables: {
          input,
          files,
        },
      });

    return (
      result.data?.createPostWithFiles ??
      null
    );
  };

  const updatePost = async ( input: UpdatePostInput ) => {
    const result =
      await updatePostMutation({
        variables: { input },
      });
    return result.data?.updatePost ?? null;
  };

  const updatePostWithFiles = async (
    input: UpdatePostInput,
    files: File[],
  ) => {
    const result = await updatePostWithFilesMutation({
        variables: {
          input,
          files,
        },
      });

    return (
      result.data?.updatePostWithFiles ?? null
    );
  };

  const deletePost = async ( postId: string ) => {
    const result = await deletePostMutation({
        variables: { postId },
      });

    return (
      result.data?.deletePost ??
      null
    );
  };

  return {
    createPost,
    createPostWithFiles,
    updatePost,
    updatePostWithFiles,
    deletePost,

    creating: creating || creatingWithFiles,
    updating: updating || updatingWithFiles,
    deleting,
  };
}