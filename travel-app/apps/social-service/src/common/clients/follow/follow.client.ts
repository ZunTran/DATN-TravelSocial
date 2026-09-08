import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import {
  FollowRelationResponse,
  FollowingProfileIdsResponse,
  FollowingProfilesResponse,
  FollowStatusResponse,
} from './follow.types';

@Injectable()
export class FollowClient {
  private readonly baseUrl =
    process.env.USER_SERVICE_URL ?? 'http://localhost:3002';

  constructor(
    private readonly http: HttpService,
  ) {}


  async getFollowingProfileIds(
    accountId: string,
  ): Promise<string[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<FollowingProfileIdsResponse>(
          `${this.baseUrl}/internal/follows/${accountId}/following-ids`,
        ),
      );

      return response.data.followingProfileIds;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'status' in error.response &&
        error.response.status === 404
      ) {
        throw new NotFoundException(
          'User account/profile not found',
        );
      }

      throw new BadGatewayException(
        'Unable to communicate with User Service',
      );
    }
  }

  async isFollowing(
    followerProfileId: string,
    followingProfileId: string,
  ): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<FollowStatusResponse>(
          `${this.baseUrl}/internal/follows/${followerProfileId}/${followingProfileId}/status`,
        ),
      );

      return response.data.isFollowing;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'status' in error.response &&
        error.response.status === 404
      ) {
        return false;
      }

      throw new BadGatewayException(
        'Unable to communicate with User Service',
      );
    }
  }


  async getFollowing(
    profileId: string,
    page: number,
    limit: number,
  ): Promise<FollowingProfilesResponse> {
    try {
      const response = await firstValueFrom(
        this.http.get<FollowingProfilesResponse>(
          `${this.baseUrl}/internal/follows/${profileId}/following`,
          {
            params: {
              page,
              limit,
            },
          },
        ),
      );

      return response.data;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'status' in error.response &&
        error.response.status === 404
      ) {
        throw new NotFoundException(
          'User profile not found',
        );
      }

      throw new BadGatewayException(
        'Unable to communicate with User Service',
      );
    }
  }

  async getRelation(
    followerProfileId: string,
    followingProfileId: string,
  ): Promise<FollowRelationResponse | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<FollowRelationResponse>(
          `${this.baseUrl}/internal/follows/${followerProfileId}/${followingProfileId}`,
        ),
      );

      return response.data;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'status' in error.response &&
        error.response.status === 404
      ) {
        return null;
      }

      throw new BadGatewayException(
        'Unable to communicate with User Service',
      );
    }
  }
}