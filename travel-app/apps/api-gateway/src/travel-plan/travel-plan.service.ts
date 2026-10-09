import { Injectable } from '@nestjs/common';

import { AiGraphqlClient } from '../common/clients/ai/ai-graphql.client';

import { CreateTravelPlanInput } from './dto/create-travel-plan.input';
import { UpdateTravelPlanInput } from './dto/update-travel-plan.input';

import {
  TravelPlanList,
  TravelPlanObject,
} from './types/travel-plan.type';

import {
  CREATE_TRAVEL_PLAN,
  DELETE_TRAVEL_PLAN,
  GET_TRAVEL_PLAN,
  GET_TRAVEL_PLANS,
  UPDATE_TRAVEL_PLAN,
} from './travel-plan.queries';

interface CreateTravelPlanResponse {
  createTravelPlan: TravelPlanObject;
}

interface GetTravelPlanResponse {
  travelPlan: TravelPlanObject;
}

interface GetTravelPlansResponse {
  travelPlans: TravelPlanList;
}

interface UpdateTravelPlanResponse {
  updateTravelPlan: TravelPlanObject;
}

interface DeleteTravelPlanResponse {
  deleteTravelPlan: boolean;
}

@Injectable()
export class TravelPlanGatewayService {
  constructor(
    private readonly aiClient: AiGraphqlClient,
  ) {}

  async create(
    input: CreateTravelPlanInput,
    accessToken?: string,
  ): Promise<TravelPlanObject> {
    const result =
      await this.aiClient.execute<CreateTravelPlanResponse>(
        CREATE_TRAVEL_PLAN,
        {
          input,
        },
        accessToken,
      );

    return result.createTravelPlan;
  }

  async findById(
    id: string,
    accessToken?: string,
  ): Promise<TravelPlanObject> {
    const result =
      await this.aiClient.execute<GetTravelPlanResponse>(
        GET_TRAVEL_PLAN,
        {
          id,
        },
        accessToken,
      );

    return result.travelPlan;
  }

  async findMany(
    pagination: {
      page: number;
      limit: number;
    },
    accessToken?: string,
  ): Promise<TravelPlanList> {
    const result =
      await this.aiClient.execute<GetTravelPlansResponse>(
        GET_TRAVEL_PLANS,
        {
          pagination,
        },
        accessToken,
      );

    return result.travelPlans;
  }

  async update(
    input: UpdateTravelPlanInput,
    accessToken?: string,
  ): Promise<TravelPlanObject> {
    const result =
      await this.aiClient.execute<UpdateTravelPlanResponse>(
        UPDATE_TRAVEL_PLAN,
        {
          input,
        },
        accessToken,
      );

    return result.updateTravelPlan;
  }

  async delete(
    id: string,
    accessToken?: string,
  ): Promise<boolean> {
    const result =
      await this.aiClient.execute<DeleteTravelPlanResponse>(
        DELETE_TRAVEL_PLAN,
        {
          id,
        },
        accessToken,
      );

    return result.deleteTravelPlan;
  }
}