import { BadGatewayException, Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

import { SERVICE_URLS } from '../../config/service-url.config';
import type { FileUpload } from 'graphql-upload-ts';

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string;}>;
}

@Injectable()
export class UserGraphqlClient {
  constructor(
    private readonly httpService: HttpService,
  ) {}

async execute<T>(
  query: string,
  variables: Record<string, unknown> = {},
  authorization?: string,
): Promise<T> {
  try {
    console.log('--- USER GRAPHQL REQUEST ---');
    console.log('QUERY:', query);
    console.log(
      'VARIABLES:',
      JSON.stringify(variables, null, 2),
    );

    const response =
      await firstValueFrom(
        this.httpService.post<GraphQLResponse<T>>(
          SERVICE_URLS.USER,
          {
            query,
            variables,
          },
          {
            headers: authorization
              ? { authorization }
              : {},
          },
        ),
      );

    if (response.data.errors?.length) {
      throw new BadGatewayException(
        response.data.errors[0].message,
      );
    }

    return response.data.data;
  } catch (error: any) {
    this.handleError(error);
  }
}


async executeUpload<T>(
  query: string,
  variables: Record<string, unknown>,
  file?: FileUpload,
  variablePath?: string,
  authorization?: string,
): Promise<T> {

  if (!file) {
    return this.execute<T>(
      query,
      variables,
      authorization,
    );
  }



  try {
    const formData = new FormData();

    const operations = {
      query,
      variables,
    };

    console.log(
      '--- GRAPHQL UPLOAD OPERATIONS ---',
    );

    console.log(
      JSON.stringify(
        operations,
        null,
        2,
      ),
    );

    formData.append(
      'operations',
      JSON.stringify(operations),
    );

    formData.append(
      'map',
      JSON.stringify({
        '0': [
          variablePath ??
            'variables.file',
        ],
      }),
    );

    const stream =
      file.createReadStream();

    formData.append(
      '0',
      stream,
      {
        filename: file.filename,
        contentType: file.mimetype,
      },
    );

    const response =
      await firstValueFrom(
        this.httpService.post<
          GraphQLResponse<T>
        >(
          SERVICE_URLS.USER,
          formData,
          {
            headers: {
              ...formData.getHeaders(),

              'apollo-require-preflight':
                'true',

              ...(authorization
                ? {
                    authorization,
                  }
                : {}),
            },

            maxContentLength:
              Infinity,

            maxBodyLength:
              Infinity,
          },
        ),
      );

    if (response.data.errors?.length) {
      throw new BadGatewayException(
        response.data.errors[0].message,
      );
    }

    return response.data.data;
  } catch (error: any) {
    this.handleError(error);
  }
}
  private handleError(
    error: any,
  ): never {
    console.error(
      '--- USER GATEWAY ERROR ---',
    );

    console.error(
      'URL:',
      SERVICE_URLS.USER,
    );

    console.error(
      'STATUS:',
      error?.response?.status,
    );

    console.error(
      'RESPONSE:',
      error?.response?.data,
    );

    console.error(
      'MESSAGE:',
      error?.message,
    );

    console.error(
      '=========================================',
    );

    if (
      error instanceof BadGatewayException
    ) {
      throw error;
    }

    throw new BadGatewayException(
      error?.response?.data ||
        error?.message ||
        'User service unavailable',
    );
  }
}