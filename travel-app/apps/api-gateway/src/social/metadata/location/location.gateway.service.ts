import { Injectable } from '@nestjs/common';
import type {
  GatewayLocation,
  GatewayLocationPage,
} from './types/location.types';
import { SocialGraphqlClient } from '../../clients/social-graphql.client';
import { AdminLocationFilterInput } from './dto/admin-location-filter.input';
import { LocationFilterInput } from './dto/location-filter.input';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { ADMIN_CREATE_LOCATION_MUTATION, ADMIN_DELETE_LOCATION_MUTATION, ADMIN_LOCATION_QUERY, ADMIN_UPDATE_LOCATION_MUTATION, LOCATION_OPTIONS_QUERY } from './location.queries';

@Injectable()
export class LocationGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}

  async locations(
  filter: LocationFilterInput,
  authorization?: string,
): Promise<GatewayLocationPage> {
    const query =LOCATION_OPTIONS_QUERY;

    const data = await this.socialClient.execute<{
        locationOptions: GatewayLocationPage;
      }>(
        query,
        {filter},
        authorization,
      );

    return data.locationOptions;
  }

async adminLocations(
  filter: AdminLocationFilterInput,
  authorization?: string,
): Promise<GatewayLocationPage> {
    const query = ADMIN_LOCATION_QUERY;
    const data = await this.socialClient.execute<{
        adminLocations: GatewayLocationPage;
      }>(
        query,
        {
          filter,
        },
        authorization,
      );

    return data.adminLocations;
  }

async createLocation(
  input: CreateLocationInput,
  authorization?: string,
): Promise<GatewayLocation> {
    const query = ADMIN_CREATE_LOCATION_MUTATION;

    const data = await this.socialClient.execute<{
        createLocation: GatewayLocation;
      }>(
        query,
        {
          input,
        },
        authorization,
      );

    return data.createLocation;
  }

async updateLocation(
  input: UpdateLocationInput,
  authorization?: string,
): Promise<GatewayLocation> {
    const query = ADMIN_UPDATE_LOCATION_MUTATION;

    const data =
      await this.socialClient.execute<{
        updateLocation: GatewayLocation;
      }>(
        query,
        {
          input,
        },
        authorization,
      );

    return data.updateLocation;
  }

  async deleteLocation(
    id: string,
    authorization?: string,
  ): Promise<boolean> {
    const query = ADMIN_DELETE_LOCATION_MUTATION;
    const data =await this.socialClient.execute<{
        deleteLocation: boolean;
      }>(
        query,
        {
          id,
        },
        authorization,
      );

    return data.deleteLocation;
  }
}