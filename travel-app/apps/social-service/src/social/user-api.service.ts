import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserClientService {
  private readonly userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3002';
  private readonly internalSecret = process.env.JWT_SECRET || 'GRADUATION_SUPER_SECRET_KEY';

  constructor(private readonly httpService: HttpService) {}


  async getAuthorProfile(authorId: string) {
    try {
      const url = `${this.userServiceUrl}/api/internal/users/${authorId}`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 3000,
          headers: {
            'Content-Type': 'application/json',
            'x-internal-secret': this.internalSecret,
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error(`[UserClient] Không thể lấy thông tin user ${authorId}:`);
      return {
        name: 'Người dùng ẩn danh',
        avatar: null,
      };
    }
  }
}