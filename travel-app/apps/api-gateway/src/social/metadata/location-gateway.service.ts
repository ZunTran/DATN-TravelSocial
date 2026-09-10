import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../clients/social-graphql.client';
import { LocationObject } from './types/metadata.types';
import { CreateLocationInput, UpdateLocationInput } from './location/dto/location.input';

interface LocationsResponse { locations: LocationObject[]; }
interface CreateLocationResponse { createLocation: LocationObject; }
interface UpdateLocationResponse { updateLocation: LocationObject; }

@Injectable()
export class LocationGatewayService {
  constructor(private readonly socialClient: SocialGraphqlClient) {}

  async locations(): Promise<LocationObject[]> {
    const data = await this.socialClient.execute<LocationsResponse>(
      `
      query Locations {
        locations {
          id
          name
          address
          latitude
          longitude
          province
        }
      }
      `,
    );
    return data.locations;
  }

  async createLocation(input: CreateLocationInput, authorization?: string): Promise<LocationObject> {
    const data = await this.socialClient.execute<CreateLocationResponse>(
      `
      mutation CreateLocation($input: CreateLocationInput!) {
        createLocation(input: $input) {
          id
          name
          address
          latitude
          longitude
          province
        }
      }
      `,
      { input },
      authorization,
    );
    return data.createLocation;
  }

  async updateLocation(input: UpdateLocationInput, authorization?: string): Promise<LocationObject> {
    const data = await this.socialClient.execute<UpdateLocationResponse>(
      `
      mutation UpdateLocation($input: UpdateLocationInput!) {
        updateLocation(input: $input) {
          id
          name
          address
          latitude
          longitude
          province
        }
      }
      `,
      { input },
      authorization,
    );
    return data.updateLocation;
  }
}