import {  Args,  ID,  Mutation,  Query,  Resolver,} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { Roles } from '../../common/auth/decorators/roles.decorator';

import { CategoryService } from './category/category.service';
import { HashtagService } from './hashtag/hashtag.service';

import { CategoryObject } from './category/objects/category.object';
import { LocationObject } from './location/objects/location.object';
import { HashtagObject } from './hashtag/objects/hashtag.object';

import { CreateCategoryInput } from './category/dto/create-category.input';
import { UpdateCategoryInput } from './category/dto/update-category.input';

import { CreateLocationInput } from './location/dto/create-location.input';
import { UpdateLocationInput } from './location/dto/update-location.input';

import { CreateHashtagInput } from './hashtag/dto/create-hashtag.input';
import { UpdateHashtagInput } from './hashtag/dto/update-hashtag.input';
import { LocationService } from './location/location.service';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MetadataResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly locationService: LocationService,
    private readonly hashtagService: HashtagService,
  ) {}


  @Query(() => [CategoryObject])
  async categories() {
    return this.categoryService.findAll();
  }

  @Mutation(() => CategoryObject)
    @UseGuards(JwtAuthGuard,RolesGuard)

  @Roles('ADMIN')
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ) {
    return this.categoryService.create(input);
  }

  @Mutation(() => CategoryObject)
    @UseGuards(JwtAuthGuard,RolesGuard)

  @Roles('ADMIN')
  async updateCategory(
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.categoryService.update(input);
  }

  @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard,RolesGuard)

  @Roles('ADMIN')
  async deleteCategory(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.categoryService.delete(id);
  }

  @Query(() => [LocationObject])
  async locations() {
    return this.locationService.findAll();
  }

  @Mutation(() => LocationObject)
    @UseGuards(JwtAuthGuard,RolesGuard)

  @Roles('ADMIN')
  async createLocation(
    @Args('input') input: CreateLocationInput,
  ) {
    return this.locationService.create(input);
  }

  @Mutation(() => LocationObject)
    @UseGuards(JwtAuthGuard,RolesGuard)

  @Roles('ADMIN')
  async updateLocation(
    @Args('input') input: UpdateLocationInput,
  ) {
    return this.locationService.update(input);
  }

  @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  async deleteLocation(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.locationService.delete(id);
  }

  @Query(() => [HashtagObject])
  async hashtags() {
    return this.hashtagService.findAll();
  }

  @Mutation(() => HashtagObject)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  async createHashtag(
    @Args('input') input: CreateHashtagInput,
  ) {
    return this.hashtagService.create(input);
  }

  @Mutation(() => HashtagObject)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  async updateHashtag(
    @Args('input') input: UpdateHashtagInput,
  ) {
    return this.hashtagService.update(input);
  }

  @Mutation(() => Boolean)
@UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  async deleteHashtag(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.hashtagService.delete(id);
  }
}