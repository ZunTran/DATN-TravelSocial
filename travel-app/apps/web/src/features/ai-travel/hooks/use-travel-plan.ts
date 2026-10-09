'use client';

import {
  useMutation,
  useQuery,
} from '@apollo/client/react';

import {
  CREATE_TRAVEL_PLAN,
  DELETE_TRAVEL_PLAN,
  GET_TRAVEL_PLAN,
  GET_TRAVEL_PLANS,
  UPDATE_TRAVEL_PLAN,
} from '../api/travel-plan.queries';

import type {
  CreateTravelPlanInput,
  TravelPlan,
  TravelPlanList,
  TravelPlansVariables,
  UpdateTravelPlanInput,
} from '../types/travel-plan.types';

interface CreateTravelPlanResponse {
  createTravelPlan: TravelPlan;
}

interface GetTravelPlanResponse {
  travelPlan: TravelPlan;
}

interface GetTravelPlansResponse {
  travelPlans: TravelPlanList;
}

interface UpdateTravelPlanResponse {
  updateTravelPlan: TravelPlan;
}

interface DeleteTravelPlanResponse {
  deleteTravelPlan: boolean;
}

export function useCreateTravelPlan() {
  const [
    createMutation,
    mutationState,
  ] = useMutation<
    CreateTravelPlanResponse,
    {
      input: CreateTravelPlanInput;
    }
  >(CREATE_TRAVEL_PLAN);

  const createTravelPlan = async (
    input: CreateTravelPlanInput,
  ): Promise<TravelPlan> => {
    const result = await createMutation({
      variables: {
        input,
      },
    });

    if (!result.data?.createTravelPlan) {
      throw new Error(
        'Không nhận được lịch trình từ server.',
      );
    }

    return result.data.createTravelPlan;
  };

  return {
    createTravelPlan,
    loading: mutationState.loading,
    error: mutationState.error,
  };
}

export function useTravelPlan(
  id?: string,
) {
  const result = useQuery<
    GetTravelPlanResponse,
    { id: string }
  >(GET_TRAVEL_PLAN, {
    variables: {
      id: id ?? '',
    },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    travelPlan: result.data?.travelPlan ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useTravelPlans(
  page = 1,
  limit = 10,
) {
  const result = useQuery<
    GetTravelPlansResponse,
    TravelPlansVariables
  >(GET_TRAVEL_PLANS, {
    variables: {
      pagination: {
        page,
        limit,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  return {
    travelPlans:
      result.data?.travelPlans ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useUpdateTravelPlan() {
  const [
    updateMutation,
    mutationState,
  ] = useMutation<
    UpdateTravelPlanResponse,
    {
      input: UpdateTravelPlanInput;
    }
  >(UPDATE_TRAVEL_PLAN);

  const updateTravelPlan = async (
    input: UpdateTravelPlanInput,
  ): Promise<TravelPlan> => {
    const result = await updateMutation({
      variables: {
        input,
      },
    });

    if (!result.data?.updateTravelPlan) {
      throw new Error(
        'Không nhận được dữ liệu lịch trình sau khi cập nhật.',
      );
    }

    return result.data.updateTravelPlan;
  };

  return {
    updateTravelPlan,
    loading: mutationState.loading,
    error: mutationState.error,
  };
}

export function useDeleteTravelPlan() {
  const [
    deleteMutation,
    mutationState,
  ] = useMutation<
    DeleteTravelPlanResponse,
    {
      id: string;
    }
  >(DELETE_TRAVEL_PLAN);

  const deleteTravelPlan = async (
    id: string,
  ): Promise<boolean> => {
    const result = await deleteMutation({
      variables: {
        id,
      },
    });

    return Boolean(
      result.data?.deleteTravelPlan,
    );
  };

  return {
    deleteTravelPlan,
    loading: mutationState.loading,
    error: mutationState.error,
  };
}

