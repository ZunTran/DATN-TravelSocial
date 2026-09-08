"use client";

import {
  useMutation,
  useQuery,
} from "@apollo/client/react";

import {
  GET_INTEREST_TAGS,
  GET_MY_INTERESTS,
  GET_USER_INTERESTS_QUERY,
  UPDATE_MY_INTERESTS,
} from "../api/interest.queries";

import { useAuthContext } from "@/features/auth/context/auth-context";

import type {
  GetInterestTagsData,
  GetMyInterestsData,
  UpdateMyInterestsData,
  UserInterestsData,
  UserInterestsVariables,
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
     {
      fetchPolicy: "cache-first",
    },
  );

  const {
    data: myInterestsData,
    loading: myInterestsLoading,
    error: myInterestsError,
    refetch: refetchMyInterests,
  } = useQuery<GetMyInterestsData>(
    GET_MY_INTERESTS,
    {
      skip:
        authLoading ||
        !isAuthenticated,
        fetchPolicy: "cache-first",
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
    refetchMyInterests
  };
}

export function useUserInterests(profileId?: string) {
  const { data, loading, error, refetch } = useQuery<
    UserInterestsData,
    UserInterestsVariables
  >(GET_USER_INTERESTS_QUERY, {
    variables: { profileId: profileId ?? ""},
    skip: !profileId,
    fetchPolicy: "cache-and-network",
  });

  return {
    interests: data?.getUserInterests ?? [],
    loading,
    error,
    refetch,
  };
}