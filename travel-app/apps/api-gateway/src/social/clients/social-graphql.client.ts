import { BadGatewayException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import { SERVICE_URLS } from '../../config/service-url.config';
import type { FileUpload } from 'graphql-upload-ts';

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

@Injectable()
export class SocialGraphqlClient {
  constructor(private readonly httpService: HttpService) {}

  async execute<T>(query: string, variables: Record<string, unknown> = {}, authorization?: string): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<GraphQLResponse<T>>(
          SERVICE_URLS.SOCIAL,
          { query, variables },
          { headers: authorization ? { authorization } : {} },
        ),
      );

      if (response.data.errors?.length) {
        throw new BadGatewayException(response.data.errors[0].message);
      }

      return response.data.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async executeMultipart<T>(query: string, variables: Record<string, unknown>, files?: Promise<FileUpload>[], authorization?: string): Promise<T> {
    try {
      const formData = new FormData();
      const uploadFiles = files ?? [];

      formData.append('operations', JSON.stringify({ query, variables }));

      const map: Record<string, string[]> = {};
      uploadFiles.forEach((_, index) => {
        map[index.toString()] = [`variables.files.${index}`];
      });
      formData.append('map', JSON.stringify(map));

      for (let index = 0; index < uploadFiles.length; index++) {
        const file = await uploadFiles[index];
        const stream = file.createReadStream();
        formData.append(index.toString(), stream, {
          filename: file.filename,
          contentType: file.mimetype,
        });
      }

      const response = await firstValueFrom(
        this.httpService.post<GraphQLResponse<T>>(
          SERVICE_URLS.SOCIAL,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'apollo-require-preflight': 'true',
              ...(authorization ? { authorization } : {}),
            },
          },
        ),
      );

      console.log('>>> Multipart upload res:', response.data);

      if (response.data.errors?.length) {
        throw new BadGatewayException(response.data.errors[0].message);
      }

      return response.data.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    console.log('=== LOG ERROR ===');
    console.log('URL:', SERVICE_URLS.SOCIAL);
    console.log('Status:', error?.response?.status);
    console.log('Data:', error?.response?.data);
    console.log('Message:', error?.message);

    if (error instanceof BadGatewayException) {
      throw error;
    }

    throw new BadGatewayException(
      error?.response?.data || error?.message || 'Social service unavailable',
    );
  }
}