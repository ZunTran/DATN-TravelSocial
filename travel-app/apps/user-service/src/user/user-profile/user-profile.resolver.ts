import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user-profile.service';
import { UserProfileObject } from './objects/user-profile.object';
import { CreateProfileInput } from './dto/create-profile.input';


@Resolver(() => UserProfileObject)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserProfileObject)
  async createProfile(
    @Args('accountId') accountId: string, 
    @Args('input') input: CreateProfileInput,
  ) {
    return this.userService.createProfile(accountId, input);
  }

  @Query(() => UserProfileObject)
  async getMyProfile(@Args('accountId') accountId: string) {
    return this.userService.getMyProfile(accountId);
  }
}