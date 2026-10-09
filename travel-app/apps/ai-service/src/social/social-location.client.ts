import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SocialLocationClient {
  constructor(
    private readonly http: HttpService,
  ) {}

  async hybridSearch(input: {
    query: string;
    province?: string;
    category?: string;
    minCost?: number;
    maxCost?: number;
    minDuration?: number;
    maxDuration?: number;
    limit?: number;
  }) {
    const url =
      `${process.env.SOCIAL_SERVICE_URL}/graphql`;

    try {
      console.log(
        '\n========== AI → SOCIAL =========='
      );

      console.log(
        '[SocialLocationClient] URL:',
        url,
      );

      console.log(
        '[SocialLocationClient] INPUT:',
        JSON.stringify(input, null, 2),
      );

      const response = await firstValueFrom(
        this.http.post(
          url,
          {
            query: `
              query HybridLocationSearch(
                $input: HybridLocationSearchInput!
              ) {
                hybridLocationSearch(input: $input) {
                  locationId
                  name
                  address
                  description
                  category
                  province
                  estimatedCost
                  durationMinutes
                  openingHours
                  similarity
                  latitude
                  longitude
                }
              }
            `,
            variables: {
              input,
            },
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log(
        '[SocialLocationClient] HTTP STATUS:',
        response.status,
      );

      console.log(
        '[SocialLocationClient] RESPONSE:',
        JSON.stringify(
          response.data,
          null,
          2,
        ),
      );

      if (response.data?.errors?.length) {
        console.error(
          '[SocialLocationClient] GRAPHQL ERRORS:',
          JSON.stringify(
            response.data.errors,
            null,
            2,
          ),
        );

        throw new Error(
          response.data.errors[0]?.message ??
            'Social GraphQL error',
        );
      }

      return (
        response.data?.data
          ?.hybridLocationSearch ?? []
      );
    } catch (error: any) {
      console.error(
        '\n========== AI → SOCIAL ERROR =========='
      );

      console.error(
        '[SocialLocationClient] message:',
        error?.message,
      );

      console.error(
        '[SocialLocationClient] response:',
        JSON.stringify(
          error?.response?.data,
          null,
          2,
        ),
      );

      console.error(
        '[SocialLocationClient] status:',
        error?.response?.status,
      );

      console.error(
        '[SocialLocationClient] stack:',
        error?.stack,
      );

      throw new BadGatewayException(
        'Không thể lấy dữ liệu địa điểm từ Social Service',
      );
    }
  }
}