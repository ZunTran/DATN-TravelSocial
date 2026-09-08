import {
    ID,
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { UserInterestService } from '../services/user-interest.service';
import { GatewayInterestPage, GatewayInterestTag } from '../types/interest-tag.type';
import { GatewayInterestPaginationInput } from '../dto/interest-pagination.input';
import { GraphQLUpload, type FileUpload } from 'graphql-upload-ts';
import { getAuthorization } from '../common/auth/gateway-auth.util';
import { CreateInterestTagInput } from '../dto/create-interest-tag.input';
import { UpdateInterestTagInput } from '../dto/update-interest-tag.input';

@Resolver()
export class UserInterestResolver {
  constructor(
    private readonly userInterestService: UserInterestService,
  ) {}

  @Query(() => [GatewayInterestTag])
  getInterestTags() {
    return this.userInterestService.getInterestTags();
  }

  @Query(() => [GatewayInterestTag])
  getMyInterests(
    @Context() context: any,
  ) {
    return this.userInterestService.getMyInterests(
      context.req?.headers?.authorization,
    );
  }

  @Query(() => [GatewayInterestTag])
  searchInterestTags(
    @Args('name')
    name: string,
  ) {
    return this.userInterestService.searchInterestTags(
      name,
    );
  }

  @Query(() => [GatewayInterestTag])
  getUserInterests(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,
  ) {
    return this.userInterestService.getUserInterests(
      profileId,
    );
  }

  @Mutation(() => [GatewayInterestTag])
  updateMyInterests(
    @Args('interestIds', {
      type: () => [ID],
    })
    interestIds: string[],

    @Context() context: any,
  ) {
    return this.userInterestService.updateMyInterests(
      interestIds,
      context.req?.headers?.authorization,
    );
  }

  @Query(() => GatewayInterestPage)
  getInterestTagsPaginated(
    @Args('input') input: GatewayInterestPaginationInput,
    @Context() context: any) {
    return this.userInterestService.getInterestTagsPaginated(
      input,
      getAuthorization(context),
    );
  }

@Mutation(() => GatewayInterestTag)
  createInterestTag(
    @Args('input', {
  type: () => CreateInterestTagInput,
})
input: CreateInterestTagInput,

    @Args('icon', {
      type: () => GraphQLUpload,
      nullable: true,
    })
    icon: FileUpload | undefined,

    @Context()
    context: any,
  ) {
    return this.userInterestService.createInterestTag(
      input,
      icon,
      getAuthorization(context),
    );
  }

 @Mutation(() => GatewayInterestTag)
  updateInterestTag(
    @Args('id', {
      type: () => ID,
    })
    id: string,

   @Args('input', { type: () => UpdateInterestTagInput}) input: UpdateInterestTagInput,
    @Args('icon', { type: () => GraphQLUpload, nullable: true }) icon: FileUpload | undefined,
    @Context() context: any ) {
    return this.userInterestService.updateInterestTag(
      id,
      input,
      icon,
      getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  deleteInterestTag(
    @Args('id', {type: () => ID}) id: string,
    @Context() context: any ) {
    return this.userInterestService.deleteInterestTag(
      id,
      getAuthorization(context),
    );
  }
}

