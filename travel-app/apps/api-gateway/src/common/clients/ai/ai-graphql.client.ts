import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';

import axios from 'axios';

@Injectable()
export class AiGraphqlClient {
  private readonly serviceUrl =
    process.env.AI_SERVICE_URL ??
    'http://localhost:3004/graphql';

  async execute<T>(
    query: string,
    variables?: Record<string, unknown>,
    accessToken?: string,
  ): Promise<T> {
    try {
      const response = await axios.post(
        this.serviceUrl,
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken
             ? {
      Authorization: accessToken,
    }
  : {}),
  
          },
        },
      );

      if (response.data?.errors?.length) {
        const message =
          response.data.errors[0]?.message ??
          'AI service request failed';

        throw new BadGatewayException(message);
      }

      return response.data.data as T;
    } catch (error: any) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException(
        error?.response?.data?.message ??
          error?.message ??
          'Không thể kết nối AI service.',
      );
    }
  }
}