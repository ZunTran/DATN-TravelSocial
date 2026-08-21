import {  Injectable,  BadGatewayException,  NotFoundException} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { UserProfileSnapshot } from './user-profile.types';

@Injectable()
export class UserProfileClient {
  private readonly baseUrl =process.env.USER_SERVICE_URL ??'http://localhost:3002';

  constructor(
    private readonly http: HttpService,
  ) {}

  async getByAccountId(
  accountId: string,
): Promise<UserProfileSnapshot> {
  try {
    const response = await firstValueFrom(
      this.http.get<UserProfileSnapshot>(
        `${this.baseUrl}/internal/user-profiles/account/${accountId}`,
      ),
    );

    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw new NotFoundException('User profile not found');
    }

    throw new BadGatewayException(
      'Unable to communicate with User Service',
    );
  }
}
}
