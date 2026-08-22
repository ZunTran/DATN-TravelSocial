import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';

import { TravelPlanService } from './travel-plan.service';

import { TravelPlanObject } from './objects/travel-plan.object';
import { TravelPlanList } from './objects/travel-plan-list.object';

import { CreateTravelPlanInput } from './dto/create-travel-plan.input';
import { UpdateTravelPlanInput } from './dto/update-travel-plan.input';

import { PaginationInput } from '../../common/dto/pagination.input';

import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';

import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';

@Resolver(() => TravelPlanObject)
export class TravelPlanResolver {
  constructor(
    private readonly service: TravelPlanService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TravelPlanObject)
  async createTravelPlan(
    @CurrentUser() user: ActiveUserData,

    @Args('input')
    input: CreateTravelPlanInput,
  ): Promise<TravelPlanObject> {
    return this.service.create(
      user.accountId,
      input,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TravelPlanObject)
  async travelPlan(
    @CurrentUser() user: ActiveUserData,

    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<TravelPlanObject> {
    return this.service.findById(
      user.accountId,
      id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TravelPlanList)
  async travelPlans(
    @CurrentUser() user: ActiveUserData,

    @Args('pagination', {
      type: () => PaginationInput,
    })
    pagination: PaginationInput,
  ): Promise<TravelPlanList> {
    return this.service.findMany(
      user.accountId,
      pagination,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TravelPlanObject)
  async updateTravelPlan(
    @CurrentUser() user: ActiveUserData,

    @Args('input')
    input: UpdateTravelPlanInput,
  ): Promise<TravelPlanObject> {
    return this.service.update(
      user.accountId,
      input,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteTravelPlan(
    @CurrentUser() user: ActiveUserData,

    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<boolean> {
    return this.service.delete(
      user.accountId,
      id,
    );
  }
}