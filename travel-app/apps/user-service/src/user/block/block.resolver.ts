import {Args,ID,Mutation,Query,Resolver} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BlockService } from './block.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';
import { PaginationInput } from '../../common/dto/pagination.input';
import { BlockObject } from './objects/block.object';
import { BlockPageObject } from './objects/block-page.object';
import { BlockInput } from './dto/block.input';

@Resolver()
export class BlockResolver {
  constructor(
    private readonly service: BlockService,
  ) {}

  @Mutation(() => BlockObject)
  @UseGuards(JwtAuthGuard)
  block(@CurrentUser() user: ActiveUserData,@Args('input') input: BlockInput) {
    return this.service.block(
      user.accountId,
      input.profileId,
      input.reason,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  unblock(@CurrentUser() user: ActiveUserData,
    @Args('profileId', { type: () => ID }) profileId: string) {
    return this.service.unblock(user.accountId, profileId);
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  isBlocked(@CurrentUser() user: ActiveUserData,@Args('profileId', { type: () => ID }) profileId: string) {
    return this.service.isBlocked(user.accountId, profileId);
  }

  @Query(() => BlockPageObject)
  @UseGuards(JwtAuthGuard)
  blockedUsers(@CurrentUser() user: ActiveUserData,@Args('input') input: PaginationInput) {
    return this.service.blockedUsers(
      user.accountId,
      input.page,
      input.limit,
    );
  }
}