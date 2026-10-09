import {
  Args,
  Context,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { PaginationInput } from '../social/post/dto/post.inputs';

import {
  TravelPlanList,
  TravelPlanObject,
} from './types/travel-plan.type';

import { CreateTravelPlanInput } from './dto/create-travel-plan.input';
import { UpdateTravelPlanInput } from './dto/update-travel-plan.input';
import { TravelPlanGatewayService } from './travel-plan.service';

@Resolver()
export class TravelPlanGatewayResolver {
  constructor(
    private readonly travelPlanGatewayService: TravelPlanGatewayService,
  ) {}

  private getAuthorization(
    context: any,
  ): string | undefined {
    return context?.req?.headers?.authorization;
  }

  @Mutation(() => TravelPlanObject)
  createTravelPlan(
    @Args('input') input: CreateTravelPlanInput,
    @Context() context: any,
  ) {
    return this.travelPlanGatewayService.create(
      input,
      this.getAuthorization(context),
    );
  }

  @Query(() => TravelPlanObject)
  travelPlan(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ) {
    return this.travelPlanGatewayService.findById(
      id,
      this.getAuthorization(context),
    );
  }

  @Query(() => TravelPlanList)
  travelPlans(
    @Args('pagination', {
      type: () => PaginationInput,
    })
    pagination: PaginationInput,
    @Context() context: any,
  ) {
    return this.travelPlanGatewayService.findMany(
      pagination,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => TravelPlanObject)
  updateTravelPlan(
    @Args('input') input: UpdateTravelPlanInput,
    @Context() context: any,
  ) {
    return this.travelPlanGatewayService.update(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  deleteTravelPlan(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ) {
    return this.travelPlanGatewayService.delete(
      id,
      this.getAuthorization(context),
    );
  }
}