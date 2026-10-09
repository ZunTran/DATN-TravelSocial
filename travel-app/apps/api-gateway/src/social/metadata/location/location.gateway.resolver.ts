import {
  Args,
  Context,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import {
  AdminLocationFilterInput,
} from './dto/admin-location-filter.input';

import {
  LocationFilterInput,
} from './dto/location-filter.input';

import {
  CreateLocationInput,
} from './dto/create-location.input';

import {
  UpdateLocationInput,
} from './dto/update-location.input';

import type {
  GatewayLocation,
  GatewayLocationPage,
} from './types/location.types';

import {
  LocationObject,
  LocationPageObject,
} from './objects/location.object';

import { LocationGatewayService } from './location.gateway.service';

@Resolver()
export class LocationGatewayResolver {
  constructor(
    private readonly locationService: LocationGatewayService,
  ) {}

  private getAuthorization(
    context: any,
  ): string | undefined {
    return context?.req?.headers?.authorization;
  }

  @Query(() => LocationPageObject)
  async locations(
    @Args('filter', {
      type: () => LocationFilterInput,
      nullable: true,
    })
    filter?: LocationFilterInput,

    @Context() context?: any,
  ): Promise<GatewayLocationPage> {
    return this.locationService.locations(
      filter ?? {
        page: 1,
        limit: 20,
      },
      this.getAuthorization(context),
    );
  }

  @Query(() => LocationPageObject)
  async adminLocations(
    @Args('filter', {
      type: () => AdminLocationFilterInput,
      nullable: true,
    })
    filter?: AdminLocationFilterInput,

    @Context() context?: any,
  ): Promise<GatewayLocationPage> {
    return this.locationService.adminLocations(
      filter ?? {
        page: 1,
        limit: 20,
      },
      this.getAuthorization(context),
    );
  }

  @Mutation(() => LocationObject)
  async createLocation(
    @Args('input', {
      type: () => CreateLocationInput,
    })
    input: CreateLocationInput,

    @Context() context?: any,
  ): Promise<GatewayLocation> {
    return this.locationService.createLocation(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => LocationObject)
  async updateLocation(
    @Args('input', {
      type: () => UpdateLocationInput,
    })
    input: UpdateLocationInput,

    @Context() context?: any,
  ): Promise<GatewayLocation> {
    return this.locationService.updateLocation(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  async deleteLocation(
    @Args('id', {
      type: () => ID,
    })
    id: string,

    @Context() context?: any,
  ): Promise<boolean> {
    return this.locationService.deleteLocation(
      id,
      this.getAuthorization(context),
    );
  }
}