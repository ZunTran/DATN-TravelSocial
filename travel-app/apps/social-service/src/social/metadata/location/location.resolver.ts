import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';

import { LocationService } from './location.service';

import { LocationObject } from './objects/location.object';
import { LocationPageObject } from './objects/location-page.object';

import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { LocationFilterInput } from './dto/location-filter.input';
import { AdminLocationFilterInput } from './dto/admin-location-filter.input';

import { RolesGuard } from '../../../common/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';
import { Roles } from '../../../common/auth/decorators/roles.decorator';

@Resolver(() => LocationObject)
export class LocationResolver {
  constructor(
    private readonly locationService: LocationService,
  ) {}

  @Query(() => LocationPageObject)
  async locationOptions(
    @Args('filter', {
      type: () => LocationFilterInput,
      nullable: true,
    })
    filter?: LocationFilterInput,
  ) {
    return this.locationService.findPage(
      filter ?? {
        page: 1,
        limit: 20,
      },
    );
  }

  @Query(() => LocationPageObject)
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  async adminLocations(
    @Args('filter', {
      type: () => AdminLocationFilterInput,
      nullable: true,
    })
    filter?: AdminLocationFilterInput,
  ) {
    return this.locationService.findPage(
      filter ?? {
        page: 1,
        limit: 20,
      },
    );
  }


  @Query(() => [LocationObject])
  async locations() {
    return this.locationService.findAll();
  }

  @Mutation(() => LocationObject)
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  async createLocation(
    @Args('input')
    input: CreateLocationInput,
  ) {
    return this.locationService.create(
      input,
    );
  }

  @Mutation(() => LocationObject)
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  async updateLocation(
    @Args('input')
    input: UpdateLocationInput,
  ) {
    return this.locationService.update(
      input,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  async deleteLocation(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ) {
    return this.locationService.delete(
      id,
    );
  }
}