import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TravelPlanItemObject } from './objects/travel-plan-item.object';
import { TravelPlanItemList } from './objects/travel-plan-item-list.object';
import { CreateTravelPlanItemInput } from './dto/create-travel-plan-item.input';
import { UpdateTravelPlanItemInput } from './dto/update-travel-plan-item.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { TravelPlanItemService } from './travel-plan-item.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';

@Resolver(() => TravelPlanItemObject)
export class TravelPlanItemResolver {
  constructor(
    private readonly service: TravelPlanItemService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TravelPlanItemObject)
  async createTravelPlanItem(
    @CurrentUser() user: ActiveUserData,
    @Args('input')
    input: CreateTravelPlanItemInput,
  ): Promise<TravelPlanItemObject> {
    return this.service.create(
      user.accountId,
      input,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TravelPlanItemObject)
  async travelPlanItem(
    @CurrentUser() user: ActiveUserData,
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<TravelPlanItemObject> {
    return this.service.findById(
      user.accountId,
      id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TravelPlanItemList)
  async travelPlanItems(
    @CurrentUser() user: ActiveUserData,
    @Args('travelPlanId', {
      type: () => ID,
    })
    travelPlanId: string,
    @Args('pagination', {
      nullable: true,
      type: () => PaginationInput,
    })
    pagination?: PaginationInput,
  ): Promise<TravelPlanItemList> {
    return this.service.findMany(
      user.accountId,
      travelPlanId,
      pagination ?? {
        page: 1,
        limit: 20,
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TravelPlanItemObject)
  async updateTravelPlanItem(
    @CurrentUser() user: ActiveUserData,
    @Args('input')
    input: UpdateTravelPlanItemInput,
  ): Promise<TravelPlanItemObject> {
    return this.service.update(
      user.accountId,
      input,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteTravelPlanItem(
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