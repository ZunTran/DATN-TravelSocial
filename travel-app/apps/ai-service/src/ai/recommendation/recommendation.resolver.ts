import { Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RecommendationLogList } from './objects/recommendation-list.object';
import { CreateRecommendationLogInput } from './dto/create-recommendation-log.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { RecommendationLogService } from './recommendation.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RecommendationLogObject } from './objects/recommendation.object';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';


@Resolver(() => RecommendationLogResolver)
export class RecommendationLogResolver {
  constructor(
    private readonly service: RecommendationLogService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => RecommendationLogObject)
  async createRecommendationLog(
    @CurrentUser() user: ActiveUserData,

    @Args('input')
    input: CreateRecommendationLogInput,
  ) {
    return this.service.create(
      user.accountId,
      input,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => RecommendationLogObject)
  async recommendationLog(
    @CurrentUser() user: ActiveUserData,

    @Args('id', {
      type: () => ID,
    })
    id: string,
  ) {
    return this.service.findById(
      user.accountId,
      id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => RecommendationLogList)
  async recommendationLogs(
    @CurrentUser() user: ActiveUserData,

    @Args('pagination')
    pagination: PaginationInput,
  ) {
    return this.service.findMany(
      user.accountId,
      pagination,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteRecommendationLog(
    @CurrentUser() user: ActiveUserData,

    @Args('id', {
      type: () => ID,
    })
    id: string,
  ) {
    return this.service.delete(
      user.accountId,
      id,
    );
  }
}
