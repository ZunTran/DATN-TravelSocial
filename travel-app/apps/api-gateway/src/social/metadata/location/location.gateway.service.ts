import {
  Injectable,
} from '@nestjs/common';


import type {
  GatewayLocation,
  GatewayLocationPage,
} from './types/location.types';
import { SocialGraphqlClient } from '../../clients/social-graphql.client';
import { AdminLocationFilterInput } from './dto/admin-location-filter.input';
import { LocationFilterInput } from './dto/location-filter.input';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';

@Injectable()
export class LocationGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}

  async locations(
  filter: LocationFilterInput,
  authorization?: string,
): Promise<GatewayLocationPage> {
    const query = `
      query LocationOptions(
        $filter: LocationFilterInput
      ) {
        locationOptions(
          filter: $filter
        ) {
          items {
            id
            name
            address
            latitude
            longitude
            province
          }
          total
          page
          limit
          totalPages
          hasNextPage
        }
      }
    `;

    const data =
      await this.socialClient.execute<{
        locationOptions: GatewayLocationPage;
      }>(
        query,
        {
          filter,
        },
        authorization,
      );

    return data.locationOptions;
  }

async adminLocations(
  filter: AdminLocationFilterInput,
  authorization?: string,
): Promise<GatewayLocationPage> {
    const query = `
      query AdminLocations(
        $filter: AdminLocationFilterInput
      ) {
        adminLocations(
          filter: $filter
        ) {
          items {
            id
            name
            address
            latitude
            longitude
            province
          }
          total
          page
          limit
          totalPages
          hasNextPage
        }
      }
    `;

    const data =
      await this.socialClient.execute<{
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
    const query = `
      mutation CreateLocation(
        $input: CreateLocationInput!
      ) {
        createLocation(
          input: $input
        ) {
          id
          name
          address
          latitude
          longitude
          province
        }
      }
    `;

    const data =
      await this.socialClient.execute<{
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
    const query = `
      mutation UpdateLocation(
        $input: UpdateLocationInput!
      ) {
        updateLocation(
          input: $input
        ) {
          id
          name
          address
          latitude
          longitude
          province
        }
      }
    `;

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
    const query = `
      mutation DeleteLocation(
        $id: ID!
      ) {
        deleteLocation(
          id: $id
        )
      }
    `;

    const data =
      await this.socialClient.execute<{
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