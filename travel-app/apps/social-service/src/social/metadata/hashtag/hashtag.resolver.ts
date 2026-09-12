import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { HashtagService } from './hashtag.service';
import { HashtagObject } from './objects/hashtag.object';
import { CreateHashtagInput } from './dto/create-hashtag.input';
import { UpdateHashtagInput } from './dto/update-hashtag.input';
import { AdminHashtagFilterInput } from './dto/admin-hashtag.input';
import { AdminHashtagListObject } from './objects/admin-hashtag.object';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/auth/guards/roles.guard';
import { Roles } from '../../../common/auth/decorators/roles.decorator';

@Resolver(() => HashtagObject)
export class HashtagResolver {
  constructor(
    private readonly hashtagService: HashtagService,
  ) {}

  @Query(() => [HashtagObject])
  async hashtags() {
    return this.hashtagService.findAll();
  }

  @Mutation(() => HashtagObject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createHashtag(
    @Args('input') input: CreateHashtagInput,
  ) {
    return this.hashtagService.create(input);
  }

  @Mutation(() => HashtagObject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateHashtag(
    @Args('input') input: UpdateHashtagInput,
  ) {
    return this.hashtagService.update(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteHashtag(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.hashtagService.delete(id);
  }

  @Query(() => AdminHashtagListObject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async adminHashtags(
    @Args('filter', {
      type: () => AdminHashtagFilterInput,
      nullable: true,
    })
    filter?: AdminHashtagFilterInput,
  ) {
    return this.hashtagService.adminGetHashtags(
      filter ?? {
        page: 1,
        limit: 20,
      },
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async adminDeleteHashtag(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.hashtagService.delete(id);
  }
}