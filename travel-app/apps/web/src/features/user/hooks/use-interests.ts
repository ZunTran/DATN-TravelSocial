"use client";

import {
  useMutation,
  useQuery,
} from "@apollo/client/react";

import {
  GET_INTEREST_TAGS,
  GET_MY_INTERESTS,
  UPDATE_MY_INTERESTS,
} from "../api/interest.queries";

import { useAuthContext } from "@/features/auth/context/auth-context";

import type {
  GetInterestTagsData,
  GetMyInterestsData,
  UpdateMyInterestsData,
} from "../types/interest";

export function useInterests() {
  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();

  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError,
  } = useQuery<GetInterestTagsData>(
    GET_INTEREST_TAGS,
  );

  const {
    data: myInterestsData,
    loading: myInterestsLoading,
    error: myInterestsError,
  } = useQuery<GetMyInterestsData>(
    GET_MY_INTERESTS,
    {
      skip:
        authLoading ||
        !isAuthenticated,
    },
  );

  const [
    updateMyInterestsMutation,
    {
      loading: saving,
      error: saveError,
    },
  ] = useMutation<
    UpdateMyInterestsData,
    {
      interestIds: string[];
    }
  >(
    UPDATE_MY_INTERESTS,
    {
      refetchQueries: [
        {
          query: GET_MY_INTERESTS,
        },
      ],
    },
  );

  const saveInterests = async (
    interestIds: string[],
  ) => {
    const result =
      await updateMyInterestsMutation({
        variables: {
          interestIds,
        },
      });

    return (
      result.data?.updateMyInterests ??
      []
    );
  };

  return {
    interests:
      tagsData?.getInterestTags ??
      [],

    myInterests:
      myInterestsData?.getMyInterests ??
      [],

    loading:
      authLoading ||
      tagsLoading ||
      myInterestsLoading,

    saving,

    error:
      tagsError ||
      myInterestsError,

    saveError,

    saveInterests,
  };
}