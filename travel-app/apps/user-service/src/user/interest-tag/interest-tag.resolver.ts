import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { InterestTagObject } from './objects/interest-tag.object';
import { InterestTagService } from './interest-tag.service';
import { RolesGuard } from '../../common/auth/guards/roles.guard';



@Resolver(() => InterestTagObject)
export class InterestTagResolver {
  constructor(
    private readonly service: InterestTagService,
  ) {}

  // =========================
  // USER
  // =========================

  @Query(() => [InterestTagObject])
  getInterestTags() {
    return this.service.findAll();
  }

  @Query(() => InterestTagObject)
  getInterestTag(
    @Args('id') id: string,
  ) {
    return this.service.findOne(id);
  }

  @Query(() => [InterestTagObject])
  searchInterestTags(
    @Args('name') name: string,
  ) {
    return this.service.search(name);
  }

  // =========================
  // ADMIN
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => InterestTagObject)
  createInterestTag(
    @Args('input')
    input: CreateInterestTagInput,
  ) {
    return this.service.create(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => InterestTagObject)
  updateInterestTag(
    @Args('id') id: string,
    @Args('input')
    input: UpdateInterestTagInput,
  ) {
    return this.service.update(
      id,
      input,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => InterestTagObject)
  deleteInterestTag(
    @Args('id') id: string,
  ) {
    return this.service.delete(id);
  }
}